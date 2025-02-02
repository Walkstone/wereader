/* 该文件中包含提供给 popup 调用或间接调用的大部分函数 */

// 获取书评
async function copyComment(userVid, isHtml) {
	const wereader = new Wereader(bookId, userVid);
	let data = await wereader.getComments();
	//遍历书评
	for (const item of data.reviews) {
		if (item.review.bookId != bookId) continue;
		var {title, content, htmlContent} = item.review;
		content = content.replace("\n", "\n\n");
		break;
	}
	if (htmlContent || content || title) {//有书评
		let copyTitle='', copyContent='';
		if(title) copyTitle = `# ${title}\n\n`;
		if(isHtml) copyContent = htmlContent;
		else copyContent = content;
		copy(`${copyTitle}${copyContent}`);
	} else {
		sendAlertMsg({text: "该书无书评",icon:'warning'});
	}
}

// 获取目录
async function copyContents(){
	const response = await sendMessageToContentScript({message: {isGetChapters: true}});
	let chapText = response.chapters.reduce((tempText, item)=>{
		tempText += `${getTitleAddedPreAndSuf(item.title, parseInt(item.level))}\n\n`;
		return tempText;
	},'');
	copy(chapText);
}

// 获取标注并复制标注到剪切板
async function copyBookMarks(isAll) {
	// 通知生成遮盖
	await sendMessageToContentScript({message: {isAddMask: true}});
	// 得到 res
	var res = "";
	if (isAll) { // 获取全书标注
		const chapsAndMarks = await getBookMarks();
		if(!chapsAndMarks) return sendAlertMsg({text: "该书无标注",icon:'warning'});
		res = chapsAndMarks.reduce((tempRes, curChapAndMarks)=>{
			let {title, level, marks} = curChapAndMarks;
			if(Config.allTitles || marks.length){
				tempRes += `${getTitleAddedPreAndSuf(title, level)}\n\n`;
				// 存在锚点标题（且不与上级标题相同）则默认将追加到上级上级标题末尾
				let anchors = curChapAndMarks.anchors
				if(anchors && anchors[0].title != title){
					anchors.forEach(anchor=>{
						tempRes += `${getTitleAddedPreAndSuf(anchor.title, anchor.level)}\n\n`
					});
				}
			}
			if(!marks.length) return tempRes;
			tempRes += traverseMarks(marks);
			return tempRes;
		},'');
		copy(res);
	} else { // 获取本章标注
		// “全书”与“本章”分别获取目录，实现页面及时遮盖
		const chapsAndMarks = await getBookMarks();
		if(!chapsAndMarks) return sendAlertMsg({text: "该书无标注",icon:'warning'});
		//遍历目录
		let targetChapAndMarks = chapsAndMarks.filter(item=>{return item.isCurrent})[0];
		let {title, level, marks} = targetChapAndMarks;
		res += `${getTitleAddedPreAndSuf(title, level)}\n\n`;
		// 存在锚点标题（且不与上级标题相同）则默认将追加到上级上级标题末尾
		let anchors = targetChapAndMarks.anchors
		if(anchors && anchors[0].title != title){
			anchors.forEach(anchor=>{
				res += `${getTitleAddedPreAndSuf(anchor.title, anchor.level)}\n\n`
			});
		}
		// 请求需要追加到文本中的图片 Markdown 文本
		const markedData = await sendMessageToContentScript({
			message: {isGetMarkedData: true, addThoughts: Config.addThoughts}
		});
		let str = traverseMarks(marks, markedData);
		res += str;
		if(str) copy(res);
		else sendAlertMsg({text: "该章节无标注",icon:'warning'});
	}
	// 通知移除遮盖
	await sendMessageToContentScript({message: {isRemoveMask: true}});
}

// 获取热门标注
async function copyBestBookMarks() {
	let bestMarks = await getBestBookMarks();
	if(!bestMarks) return; // 无热门标注
	//遍历 bestMark
	let res = bestMarks.reduce((tempRes, curChapAndBestMarks)=>{
		let {title, level, bestMarks} = curChapAndBestMarks;
		if(Config.allTitles || bestMarks.length){
			tempRes += `${getTitleAddedPreAndSuf(title, level)}\n\n`;
			// 存在锚点标题（且不与上级标题相同）则默认将追加到上级上级标题末尾
			let anchors = curChapAndBestMarks.anchors
			if(anchors && anchors[0].title != title){
				anchors.forEach(anchor=>{
					tempRes += `${getTitleAddedPreAndSuf(anchor.title, anchor.level)}\n\n`
				});
			}
		}
		if(!bestMarks.length) return tempRes;
		bestMarks.forEach(bestMark=>{
			let {markText, totalCount} = bestMark;
			if(Config.displayN) totalCount = `  <u>${totalCount}</u>`;
			else totalCount = '';
			tempRes += `${markText}${totalCount}\n\n`;
		});
		return tempRes;
	},'');
	copy(res);
}

// 获取想法
async function copyThought() {
	let contents = await getChapters();
	contents = contents.reduce((tempContents, aChap)=>{
		//整理格式
		tempContents[aChap.chapterUid] = { title: aChap.title, level: aChap.level};
		return tempContents;
	},{});
	let thoughts = await getMyThought();
	let res = "";
	//thoughts——{chapterUid:[{abstract,content}]}
	for (let key in thoughts) {
		res += `${getTitleAddedPreAndSuf(contents[key].title, contents[key].level)}\n\n`;
		thoughts[key].forEach(thou=>{
			res += `${Config.thouMarkPre}${thou.abstract}${Config.thouMarkSuf}\n\n`;
			res += `${Config.thouPre}${thou.content}${Config.thouSuf}\n\n`;
		});
	}
	if(!res) sendAlertMsg({text: "该书无想法",icon:'warning'});
	else copy(res);
}

// 获取当前读书页的 bookId
async function setBookId(){
	return new Promise((res, rej)=>{
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			if(catchErr('setBookId')) {
				alert("bookId 获取出错，请刷新后重试。");
				return rej(false);
			}
			const tab = tabs[0];
			if(tab.url.indexOf('//weread.qq.com/web/reader/') < 0) return;
			if(!bookIds[tab.id]) {
				alert("信息缺失，请先刷新。");
				return rej(false);
			} else bookId = bookIds[tab.id];
			return res(true);
		})
	}).catch(err=>{});
}

// 获取书架 json 数据
async function getShelfData(){
	const userVid = await getUserVid();
	const wereader = new Wereader(bookId, userVid);
	const shelfData = await wereader.getShelfData();
	return shelfData;
}

// 创建微信公众号浏览页面
var sendMpMsg = undefined;
async function createMpPage(bookId){
	let json = undefined;
	if(mpTempData.bookId && mpTempData.bookId[0]){
		json = mpTempData.bookId[0];
	}else{
		let resp = await fetch(`https://i.weread.qq.com/book/articles?bookId=${bookId}&count=10&offset=0`);
		console.log('resp', resp);
		json = await resp.json();
		if(json.errmsg) return json;
		if(!mpTempData[bookId]){
			mpTempData[bookId] = [];
		}
		mpTempData[bookId][0] = json;
	}
	sendMpMsg = {data: json, bookId: bookId};
	chrome.tabs.create({url: chrome.runtime.getURL('popup/mpwx/mp.html')});
	return json;
}

// 设置供 popup 获取的书架数据
async function setShelfData(shelfData){
	if(shelfData){
		window.shelfForPopup.shelfData = shelfData;
	}else{
		window.shelfForPopup.shelfData = await getShelfData();
		return window.shelfForPopup.shelfData;
	}
};

// 删除标注
async function deleteBookmarks(isAll=false){
    const wereader = new Wereader(bookId);
    const chaps = await getChapters();
	const curChap = chaps.filter(chap=>{return chap.isCurrent;})[0];
    const respJson = await wereader.removeBookmarks(isAll ? undefined : curChap.chapterUid);
	return respJson;
}

async function getReadDetail(type=1, count=3, monthTimestamp){
	const wereader = new Wereader(bookId);
	const readdetail = await wereader.getReadDetail(type, count, monthTimestamp);
	return readdetail;
}
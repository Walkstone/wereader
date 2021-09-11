# 如何贡献

## 浏览器扩展（以 Chrome 为例）

你是否用过某种为页面开启护眼色或是夜色背景的主题扩展？它是如何实现的？

简单来说，一个网页是由 HTML 及嵌入在 HTML 里面的 CSS 文件（或 CSS 文本）和 JavaScript 文件（或 JavaScript 文本）组成的。HTML定义网页的结构，CSS 描述网页的样子，JavaScript为页面设置交互。

因为CSS可以改变网页的样子，所以主题扩展改变页面外观的一种常见方式即在页面中注入 CSS 文件，但是

```
📦wereader-chrome
 ┣ 📂background
 ┃ ┣ 📜background.html
 ┃ ┣ 📜bg-develop.js
 ┃ ┣ 📜bg-init.js
 ┃ ┣ 📜bg-popup-process.js
 ┃ ┣ 📜bg-popup.js
 ┃ ┣ 📜bg-regist.js
 ┃ ┣ 📜bg-utils.js
 ┃ ┣ 📜bg-vars.js
 ┃ ┗ 📜clipboard.min.js
 ┣ 📂content
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂css
 ┃ ┃ ┣ 📂fancybox
 ┃ ┃ ┃ ┣ 📜fancybox.css
 ┃ ┃ ┃ ┗ 📜fancybox.js
 ┃ ┃ ┣ 📂js
 ┃ ┃ ┃ ┗ 📜jQuery.min.js
 ┃ ┃ ┗ 📂sweetalert2
 ┃ ┃ ┃ ┣ 📜sweetalert2.min.css
 ┃ ┃ ┃ ┗ 📜sweetalert2.min.js
 ┃ ┣ 📂css
 ┃ ┃ ┣ 📜content-copyBtn.css
 ┃ ┃ ┣ 📜content-hideScroll.css
 ┃ ┃ ┣ 📜rankChapter.css
 ┃ ┃ ┗ 📜shelfOrganizing.css
 ┃ ┗ 📂js
 ┃ ┃ ┣ 📜content-alert.js
 ┃ ┃ ┣ 📜content-copyBtn.js
 ┃ ┃ ┣ 📜content-deleteBookmarks.js
 ┃ ┃ ┣ 📜content-getChapters.js
 ┃ ┃ ┣ 📜content-markedData.js
 ┃ ┃ ┣ 📜content-rightClick.js
 ┃ ┃ ┣ 📜content-scroll-bar.js
 ┃ ┃ ┣ 📜content-scrollNote.js
 ┃ ┃ ┣ 📜content-select-action.js
 ┃ ┃ ┣ 📜content-theme.js
 ┃ ┃ ┣ 📜content-utils.js
 ┃ ┃ ┗ 📜shelfOrganizing.js
 ┣ 📂icons
 ┃ ┣ 📜icon128.png
 ┃ ┣ 📜icon16.png
 ┃ ┣ 📜icon24.png
 ┃ ┣ 📜icon32.png
 ┃ ┗ 📜icon48.png
 ┣ 📂inject
 ┃ ┗ 📜showScroll.css
 ┣ 📂options
 ┃ ┣ 📂icons
 ┃ ┃ ┣ 📜button_delete.png
 ┃ ┃ ┣ 📜button_edit.png
 ┃ ┃ ┣ 📜button_new.png
 ┃ ┃ ┣ 📜chapterLevel.png
 ┃ ┃ ┣ 📜mark.png
 ┃ ┃ ┣ 📜markstyle1.png
 ┃ ┃ ┣ 📜markstyle2.png
 ┃ ┃ ┗ 📜markstyle3.png
 ┃ ┣ 📜options-help.js
 ┃ ┣ 📜options-main.js
 ┃ ┣ 📜options-utils.js
 ┃ ┣ 📜options-variables.js
 ┃ ┣ 📜options.css
 ┃ ┗ 📜options.html
 ┣ 📂popup
 ┃ ┣ 📂mpwx
 ┃ ┃ ┣ 📜mp.css
 ┃ ┃ ┣ 📜mp.html
 ┃ ┃ ┗ 📜mp.js
 ┃ ┣ 📂statistics
 ┃ ┃ ┣ 📜Chart.min.js
 ┃ ┃ ┣ 📜statistics.css
 ┃ ┃ ┣ 📜statistics.html
 ┃ ┃ ┣ 📜statistics.js
 ┃ ┃ ┣ 📜test-month.json
 ┃ ┃ ┗ 📜test-week.json
 ┃ ┣ 📜popup-develop.js
 ┃ ┣ 📜popup-dispose.js
 ┃ ┣ 📜popup-note.js
 ┃ ┣ 📜popup-shelf.js
 ┃ ┣ 📜popup-vars.js
 ┃ ┣ 📜popup.css
 ┃ ┗ 📜popup.html
 ┣ 📂scripts
 ┃ ┣ 📜pack.py
 ┃ ┣ 📜test.js
 ┃ ┗ 📜test.py
 ┣ 📂theme
 ┃ ┣ 📜dark.css
 ┃ ┣ 📜green.css
 ┃ ┣ 📜orange.css
 ┃ ┗ 📜white.css
 ┗ 📜manifest.json
```
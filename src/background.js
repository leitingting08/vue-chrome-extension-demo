chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Hello from the background", request, sender.id, sendResponse);

  return true;
});

chrome.contextMenus.create({
  id: "page",
  title: "测试右键菜单"
});
chrome.contextMenus.create({
  id: "baidu-search",
  title: "使用百度搜索：%s",
  contexts: ["selection"]
});
chrome.contextMenus.onClicked.addListener(function(info) {
  switch (info.menuItemId) {
    case "baidu-search":
      chrome.tabs.create({
        url:
          "https://www.baidu.com/s?ie=utf-8&wd=" + encodeURI(info.selectionText)
      });
      break;
    case "page":
       chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icons/ali.png',
        title: '这是标题',
        message: '您刚才点击了自定义右键菜单！'
       });
      break;
  }
});


// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log('inputChanged: ' + text);
  if(!text) return;
  if(text == 'c') {
  suggest([
  {content: 'extension' + text, description: 'chrome://extension'},
  {content: 'bookmarks' + text, description: 'chrome://bookmarks'},
  {content: 'history' + text, description: 'chrome://history'}
  ]);
  }
 });
 // 当用户接收关键字建议时触发
 chrome.omnibox.onInputEntered.addListener((text) => {
  console.log('inputEntered: ' + text);
  if(!text) return;
  var href = '';
  if(text.endsWith('extension')) href = 'chrome://extension'
  else if(text.endsWith('history')) href = 'chrome://history'
  else href = 'chrome://bookmarks'
  openUrlCurrentTab(href);
 });
 // 获取当前选项卡ID
 function getCurrentTabId(callback)
 {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
  {
  if(callback) callback(tabs.length ? tabs[0].id: null);
  });
 }
 // 当前标签打开某个链接
 function openUrlCurrentTab(url)
 {
  getCurrentTabId(tabId => {
  chrome.tabs.update(tabId, {url: url});
  })
 }




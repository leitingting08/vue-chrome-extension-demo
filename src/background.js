const page = {
  init() {
    this.initContextMenus()
    this.initOmnibox()
    this.initPageAction()
  },
  initContextMenus() {
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
  },
  initOmnibox() {
    const self = this
    // omnibox 演示 关键词输入改变触发
    chrome.omnibox.onInputChanged.addListener((text, suggest) => {
      console.log('inputChanged: ' + text);
      if(!text) return;
      if(text.indexOf('c')!== -1) {
      suggest([
        {content: 'settings', description: 'chrome://settings'},
        {content: 'version', description: 'chrome://version'},
        {content: 'extensions', description: 'chrome://extensions'},
        {content: 'bookmarks', description: 'chrome://bookmarks'},
        {content: 'history', description: 'chrome://history'}
      ]);
      }
    });
    // 当用户接收关键字建议时触发
    chrome.omnibox.onInputEntered.addListener((text) => {
      console.log('inputEntered: ' + text);
      if(!text) return;
      var href = '';
      switch(text){
        case text.endsWith('bookmarks'):
          href = 'chrome://bookmarks'
          break
        case text.endsWith('history'):
          href = 'chrome://history'
          break
        case text.endsWith('settings'):
          href = 'chrome://settings'
          break
        case text.endsWith('version'):
          href = 'chrome://version'
          break
        case text.endsWith('extensions'):
          href = 'chrome://extensions'
          break
        default:
          href = 'chrome://extensions'
          break
      }
      self.openUrlCurrentTab(href);
    });
  },
  initPageAction() {
    // chrome.tabs.onActivated.addListener((activeInfo) => {
    //   console.log(activeInfo)
    // });
    chrome.runtime.onInstalled.addListener(function(){
      chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
      chrome.declarativeContent.onPageChanged.addRules([
      {
      conditions: [
      // 只有打开百度才显示pageAction
        new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
      ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
      ]);
      });
    });
  },
  getCurrentTabId() { // 获取当前选项卡id
    let tabId = null
    chrome.tabs.query({active: true, currentWindow: true},(tabs)=>
    {
      tabId = tabs.length ? tabs[0].id: null
    });
    return tabId
  },
  openUrlCurrentTab(url) { // 打开新页面
    const tabId = this.getCurrentTabId()
    chrome.tabs.update(tabId, {url: url});
  }
}

 page.init()


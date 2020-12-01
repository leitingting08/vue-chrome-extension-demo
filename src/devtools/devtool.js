// 创建自定义面板，同一个插件可以创建多个自定义面板
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create("TestPanel", "", "devtools.html", function(
  panel
) {
  console.log("自定义面板创建成功！", panel); // 注意这个log一般看不到
});
// // 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane("Images", function(sidebar) {
  //   sidebar.setPage("devtools.html"); // 指定加载某个页面
    sidebar.setExpression('document.querySelectorAll("img")', 'All Images'); // 通过表达式来指定
    // sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
});

// 下列代码实现了记录所有加载过的大于40kb的图片的URL：
chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    if (request.response.bodySize > 40*1024)
    chrome.experimental.devtools.console.addMessage(
        chrome.experimental.devtools.console.Severity.Warning,
        "Large image: " + request.request.url);
});
chrome.runtime.sendMessage({ greet: "hello" }, function(response) {
  console.log("content get response:", response);
});

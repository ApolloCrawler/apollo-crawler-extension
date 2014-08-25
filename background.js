chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {file:"jquery-2.1.1.min.js"});
	chrome.tabs.executeScript(null, {file:"contentscript.js"});
});

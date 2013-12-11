// Run our script as soon as the document's DOM is ready.

document.addEventListener('DOMContentLoaded', function () {

  console.log("Apollo Crawler Extension Ready!");
});

chrome.devtools.panels.create("Apollo Crawler",
    "MyPanelIcon.png",
    "panel.html",
    function(panel) {
      // code invoked on panel creation
      // chrome.extension.getBackgroundPage().console.log('foo');
      chrome.devtools.inspectedWindow.eval('console.log(' + "test" + ');');
    }
);
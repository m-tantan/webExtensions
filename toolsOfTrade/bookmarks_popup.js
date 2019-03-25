// Gets the background script code, can access window variables from here
let bgPage = chrome.extension.getBackgroundPage(); 

// Waits for the popup to load.
document.addEventListener('DOMContentLoaded', function(event) {
    console.log("Loaded the popup");
    // 0 root, 1 bar (bookmarksBar.id [not working]), 2 other, 3 mobile
    // chrome.bookmarks.create({'parentId': "1",
    //                           'index': 3,
    //                           'title': 'MyFolder/Extensions doc',
    //                             'url': 'http://code.google.com/chrome/extensions'
    //                           });  
    var res = chrome.bookmarks.create({ 
      'parentId': "1",
      'title': 'Extension bookmarks'}
    );

    chrome.bookmarks.create({
      'title': "Extension bookmarks\\InsideBookmark",
      'url': 'https://www.ynet.co.il/home/0,7340,L-8,00.html',
      'index': 0,
      'parentId': "shalom"
    });
  
})

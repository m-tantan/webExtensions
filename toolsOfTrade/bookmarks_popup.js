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
    // var res = chrome.bookmarks.create({ 
    //   'parentId': "1",
    //   'title': 'Extension bookmarks'}
    // );

    chrome.bookmarks.create({
      'title': "Folder",
      'index': 0,
      'parentId': "1"
    }, createUrlWithin);
})

function createUrlWithin(newBookmark){
  console.log("added bookmark with name: " + newBookmark.title);
  console.log("In general, the bookmark object is this: ", newBookmark);

  chrome.bookmarks.create({
    'title': newBookmark.title + "link",
    'url': "http://code.google.com/chrome/extensions", 
    'parentId': newBookmark["id"]
  });
}

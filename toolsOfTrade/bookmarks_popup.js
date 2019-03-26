var activated = false;

// Gets the background script code, can access window variables from here
let bgPage = chrome.extension.getBackgroundPage();

// Waits for the popup to load.
document.addEventListener('DOMContentLoaded', function (event) {
  console.log("Loaded the popup");
  // 0 root, 1 bar (bookmarksBar.id [not working]), 2 other, 3 mobile

  // Used to fetch a folder / single url
  var fetchPromiseFolder = chrome.bookmarks.get(["243"], onFetchBookmarkSuccess);

  // Used to get the children within a folder with a known Id
  var fetchPromiseChildren = chrome.bookmarks.getChildren("243", onFetchBookmarkSuccess);


  if (activated) {
    chrome.bookmarks.create({
      'title': "Folder",
      'index': 0,
      'parentId': "1"
    }, createUrlWithin);
  }
})

function createUrlWithin(newBookmark) {
  console.log("added bookmark with name: " + newBookmark.title);
  console.log("In general, the bookmark object is this: ", newBookmark);

  chrome.bookmarks.create({
    'title': newBookmark.title + "link",
    'url': "http://code.google.com/chrome/extensions",
    'parentId': newBookmark["id"]
  });
}

function onFetchBookmarkSuccess(bookmarks) {
  bookmarks.forEach(element => {
    console.log(element);
    // element.forEach(elem => {
    //   console.log(`I'm a child ${elem.child}`)
    // });
  });
}
function onFetchBookmarkFail(err) {
  console.log(`Err: ${err}`);
}
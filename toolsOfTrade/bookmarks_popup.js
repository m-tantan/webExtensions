// Developing vars
var activated = false;

/* -------------------- CONSTANTS -------------------*/
// List of available containers for bookmarks to iterate over
const BOOKMARKS_BAR = 1;
const OTHER_BOOKMARKS_FOLDER = 2;
const MOBILE_BOOKMARKS = 3;

const INITIALIZE = 0;
const GET_CURRENT_BOOKMARK_FOLDERS = 1;
const OPEN_AS_TABS = 2;
const SAVE_URLS_TO_BOOKMARK_FOLDER = 3;


var mode = INITIALIZE;
// Gets the background script code, can access window variables from here
let bgPage = chrome.extension.getBackgroundPage();

// Waits for the popup to load. Code goes in here
document.addEventListener('DOMContentLoaded', function (event) {
  console.log("Loaded the popup");

  // Setup
  var urlTextArea = document.getElementById("urlInputBox");
  var clearBtn = document.getElementById("clearBtn");
  var proceedBtn = document.getElementById("proceedBtn");
  var urlTextGuidance = document.getElementById("guidanceText");
  var radioButtons = document.getElementsByClassName("form-check-input");

  // 'Define' radio buttons 
  const shareFoldersRadio = radioButtons[0];
  const openAsTabsRadio = radioButtons[1];
  const importNewFolderFromUrlRadio = radioButtons[2];

  // Setu radio buttons' onclick
  shareFoldersRadio.onclick = function (ev) {
    mode = GET_CURRENT_BOOKMARK_FOLDERS;
    console.log("Will get all bookmarks");
    urlTextArea.classList.add("hideElem");
    urlTextGuidance.classList.add("hideElem");
    document.body.style.height = '135px';
  };
  openAsTabsRadio.onclick = function (ev) {
    mode = OPEN_AS_TABS;
    console.log("Copied all active tabs");
    urlTextArea.classList.remove("hideElem");
    urlTextGuidance.classList.remove("hideElem");
    document.body.style.height = '450px';
  };
  importNewFolderFromUrlRadio.onclick = function (ev) {
    mode = SAVE_URLS_TO_BOOKMARK_FOLDER;
    console.log("Creating a new bookmark folder from given links");
    urlTextArea.classList.remove("hideElem");
    urlTextGuidance.classList.remove("hideElem");
    document.body.style.height = '450px';
  };

  // Set up buttons' onclick here
  clearBtn.onclick = function (ev) {
    console.log("Deleting textarea content");
  };

  proceedBtn.onclick = function (ev) {
    console.log("Proceed btn clicked");

    // If user wishes to open several links together
    if (mode == GET_CURRENT_BOOKMARK_FOLDERS || mode == INITIALIZE){

    }
    else if (mode == OPEN_AS_TABS) { 
      var unparsedUrlsToOpen = urlTextArea.value;
      var parsedUrlsToOpen = unparsedUrlsToOpen.split("\n");
      for (i = 0; i < parsedUrlsToOpen.length; i++) {
        website = parsedUrlsToOpen[i];
        console.log("Opening new tab with: ", website);
        chrome.tabs.create({ 'url': website });
      }
    }
    else if (mode == SAVE_URLS_TO_BOOKMARK_FOLDER){
      
    }
  };

  // 0 root, 1 bar (bookmarksBar.id [not working]), 2 other, 3 mobile
  // Used to fetch a folder / single url
  var fetchPromiseFolder = chrome.bookmarks.get(["255"], onFetchBookmarkSuccess);

  // // Used to get the children within a folder with a known Id
  var fetchPromiseChildren = chrome.bookmarks.getChildren("255", onFetchBookmarkSuccess);
  if (activated) {
    chrome.bookmarks.create({
      'title': "Folder",
      'index': 0,
      'parentId': "0"
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

const generalListOfBookmarks = [BOOKMARKS_BAR, OTHER_BOOKMARKS_FOLDER, MOBILE_BOOKMARKS]
var listOfBookmarks = [];
function getAllBookmarks() {
  generalListOfBookmarks.forEach(cat => {

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
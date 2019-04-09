// Developing vars
var activated = false;

/* -------------------- CONSTANTS -------------------*/
// List of available containers for bookmarks to iterate over
// 0 root, 1 bar (bookmarksBar.id [not working]), 2 other, 3 mobile
const BOOKMARKS_BAR = 1;
const OTHER_BOOKMARKS_FOLDER = 2;
const MOBILE_BOOKMARKS = 3;

const INITIALIZE = 0;
const GET_CURRENT_BOOKMARK_FOLDERS = 1;
const OPEN_AS_TABS = 2;
const SAVE_URLS_TO_BOOKMARK_FOLDER = 3;

// Pre-script preparation 
var mode = INITIALIZE;
var parentFolderId = BOOKMARKS_BAR;
const generalListOfBookmarks = [BOOKMARKS_BAR, OTHER_BOOKMARKS_FOLDER, MOBILE_BOOKMARKS]
let bgPage = chrome.extension.getBackgroundPage();  // Gets the background script code, can access window variables from here
var tabsToOpenList = [];
var linksToSaveList = [];

// Waits for the popup to load. Code goes in here
document.addEventListener('DOMContentLoaded', function (event) {
  console.log("Loaded the popup");

  // Setup
  var urlTextArea = document.getElementById("urlInputBox");
  var clearBtn = document.getElementById("clearBtn");
  var proceedBtn = document.getElementById("proceedBtn");
  var bookmarkBarRadio = document.getElementById("intoBookmarkBar");
  var otherBookmarksRadio = document.getElementById("intoOtherFolder");
  var urlTextGuidance = document.getElementById("guidanceText");
  var radioButtons = document.getElementsByClassName("form-check-input");
  var newFolderInputText = document.getElementById("folderNameId");
  var newFolderNameInput = document.getElementById("folderNameInput");

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
    newFolderInputText.classList.add("hideElem");
    newFolderNameInput.classList.add("hideElem");

    document.body.style.height = '140px';
  };
  openAsTabsRadio.onclick = function (ev) {
    mode = OPEN_AS_TABS;
    console.log("Copied all active tabs");
    urlTextArea.classList.remove("hideElem");
    urlTextGuidance.classList.remove("hideElem");
    newFolderInputText.classList.add("hideElem");
    newFolderNameInput.classList.add("hideElem");
    
    document.body.style.height = '450px';
  };
  importNewFolderFromUrlRadio.onclick = function (ev) {
    mode = SAVE_URLS_TO_BOOKMARK_FOLDER;
    console.log("Creating a new bookmark folder from given links");
    urlTextArea.classList.remove("hideElem");
    urlTextGuidance.classList.remove("hideElem");
    newFolderInputText.classList.remove("hideElem");
    newFolderNameInput.classList.remove("hideElem");
    document.body.style.height = '460px';
  };

  // Set up buttons' onclick here
  clearBtn.onclick = function (ev) {
    console.log("Deleting textarea content");
  };

  bookmarkBarRadio.onclick = function(ev) {
    parentFolderId = BOOKMARKS_BAR;
    console.log(`Select BookmarkBar`);
  };

  otherBookmarksRadio.onclick = function(ev) {
    parentFolderId = OTHER_BOOKMARKS_FOLDER;
    console.log(`Select Other bookmark folder`);
  };

  proceedBtn.onclick = function (ev) {
    console.log("Proceed btn clicked");

    // If user wishes to open several links together
    if (mode == GET_CURRENT_BOOKMARK_FOLDERS || mode == INITIALIZE){
      generalListOfBookmarks.forEach(cat => {
        var catAsStr = cat.toString();
        chrome.bookmarks.get([catAsStr], onFetchBookmarkSuccess);
      });

    }
    else if (mode == OPEN_AS_TABS) { 
      var unparsedUrlsToOpen = urlTextArea.value;
      var parsedUrlsToOpen = unparsedUrlsToOpen.split("\n");
      if (unparsedUrlsToOpen.length > 0){
        for (i = 0; i < parsedUrlsToOpen.length; i++) {
          website = parsedUrlsToOpen[i];
          console.log("Opening new tab with: ", website);
          chrome.tabs.create({ 'url': website });
        }
      }
    }
    else if (mode == SAVE_URLS_TO_BOOKMARK_FOLDER){ // If Create a folder was selected
      var unparsedUrlsToOpen = urlTextArea.value;
      if (unparsedUrlsToOpen.length > 0){
        var parsedUrlsToOpen = unparsedUrlsToOpen.split("\n");

        for (i = 0; i < parsedUrlsToOpen.length; i++) {
          website = parsedUrlsToOpen[i];
          console.log("Saving new bookmark: ", website);
        }
        linksToSaveList = parsedUrlsToOpen;
        chrome.bookmarks.create({
          'title': newFolderNameInput.value.toString(),
          'index': 0,
          'parentId': parentFolderId.toString()
        }, createUrlsWithin);
        
      }
    }
  };

  // Used to fetch a folder / single url
  
  // // Used to get the children within a folder with a known Id
  if (activated) {
    var fetchPromiseChildren = chrome.bookmarks.getChildren("255", onFetchBookmarkSuccess);
    var fetchPromiseFolder = chrome.bookmarks.get(["255"], onFetchBookmarkSuccess);
    chrome.bookmarks.create({
      'title': "Folder",
      'index': 0,
      'parentId': "0"
    }, createUrlsWithin);
  }
})

function createUrlsWithin(newBookmarkFolder, listOfLinks) {
  console.log("added bookmark folder with name: " + newBookmarkFolder.title);
  console.log("In general, the bookmark object is this: ", newBookmarkFolder);
  console.log(`listOfLinks: ${listOfLinks}`)
  linksToSaveList.forEach( (link) => {
    var getNameRegex = /^https?:\/\/(www)?\.?([\w]*).*$/gm;
    var matches = getNameRegex.exec(link);
    var urlName = matches[2];
    chrome.bookmarks.create({
      'title': urlName,
      'url': link,
      'parentId': newBookmarkFolder.id.toString()
    });

  });
}

var listOfBookmarks = [];

function getAllBookmarks() {
  generalListOfBookmarks.forEach(cat => {

  });
}

function onFetchBookmarkSuccess(bookmarks) {
  bookmarks.forEach(element => {
    console.log(element);
    console.log(element.id);
    chrome.bookmarks.getChildren(element.id, onGetChildrenSuccess)
  });
}

function onGetChildrenSuccess(children){
  // var listOfFolderNames = [];
  // var listOfFolderIds = [];
  var foldersDict = {};
  children.forEach((child)=> {
    if (child.url == null){
      console.log(`Found folder: ${child.title}`)
      // listOfFolderNames.add(child.title);
      // listOfFolderIds.add(child.id);
      foldersDict[child.title] = child.id;
    }
  })
  
  return foldersDict;
}

function onFetchBookmarkFail(err) {
  console.log(`Err: ${err}`);
}
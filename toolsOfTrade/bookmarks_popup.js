// Developing vars
var activated = false;

/* -------------------- CONSTANTS -------------------*/
// List of available containers for bookmarks to iterate over
// 0 root, 1 bar (bookmarksBar.id [not working]), 2 other, 3 mobile
const BOOKMARKS_BAR = 1;
const OTHER_BOOKMARKS_FOLDER = 2;
const MOBILE_BOOKMARKS = 3;

const GET_CURRENT_BOOKMARK_FOLDERS = 1;
const OPEN_AS_TABS = 2;
const SAVE_URLS_TO_BOOKMARK_FOLDER = 3;

// Pre-script preparation 
var mode = GET_CURRENT_BOOKMARK_FOLDERS;
var parentFolderId = BOOKMARKS_BAR;
var loadedFolders = false;
const generalListOfBookmarks = [BOOKMARKS_BAR, OTHER_BOOKMARKS_FOLDER, MOBILE_BOOKMARKS]
let bgPage = chrome.extension.getBackgroundPage();  // Gets the background script code, can access window variables from here
var tabsToOpenList = [];
var linksToSaveList = [];
var foldersDict = {};
var nSelectedFolder = 0;
var urlsToShareString = "";

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
  let folderDiv = document.getElementById("folderDivId");

  // 'Define' radio buttons 
  var shareFoldersRadio = radioButtons[0];
  var openAsTabsRadio = radioButtons[1];
  var importNewFolderFromUrlRadio = radioButtons[2];
  
  generalListOfBookmarks.forEach(cat => {
    var catagoryAsStr = cat.toString();
    chrome.bookmarks.get([catagoryAsStr], onFetchBookmarkSuccess);
  });   
  console.log(`The folders dict is: ${foldersDict.length}`);
  // Setup radio buttons' onclick
  shareFoldersRadio.onclick = function (ev) {
    mode = GET_CURRENT_BOOKMARK_FOLDERS;
    console.log("Will get all bookmarks");
    urlTextArea.classList.add("hideElem");
    urlTextGuidance.classList.add("hideElem");
    newFolderInputText.classList.add("hideElem");
    newFolderNameInput.classList.add("hideElem");
    clearBtn.classList.add("hideElem");
    folderDiv.classList.remove("hideElem");

    document.body.style.height = '145px';
  };

  openAsTabsRadio.onclick = function (ev) {
    mode = OPEN_AS_TABS;
    console.log("Copied all active tabs");
    urlTextArea.classList.remove("hideElem");
    urlTextGuidance.classList.remove("hideElem");
    newFolderInputText.classList.add("hideElem");
    newFolderNameInput.classList.add("hideElem");
    clearBtn.classList.remove("hideElem");
    folderDiv.classList.add("hideElem");

    document.body.style.height = '450px';
  };

  importNewFolderFromUrlRadio.onclick = function (ev) {
    mode = SAVE_URLS_TO_BOOKMARK_FOLDER;
    console.log("Creating a new bookmark folder from given links");
    urlTextArea.classList.remove("hideElem");
    urlTextGuidance.classList.remove("hideElem");
    newFolderInputText.classList.remove("hideElem");
    newFolderNameInput.classList.remove("hideElem");
    clearBtn.classList.remove("hideElem");
    folderDiv.classList.add("hideElem");
    
    document.body.style.height = '475px';
  };

  // Set up buttons' onclick here
  clearBtn.onclick = function (ev) {
    console.log("Deleting textarea content");
    urlTextArea.value = "";
  };

  clearBtn.onmouseenter = function (ev) {
    clearBtn.classList.add("clear-btn-urge");
  };

  clearBtn.onmouseleave = function (ev) {
    clearBtn.classList.remove("clear-btn-urge");
  };

  bookmarkBarRadio.onclick = function (ev) {
    parentFolderId = BOOKMARKS_BAR;
    console.log(`Select BookmarkBar`);
  };

  otherBookmarksRadio.onclick = function (ev) {
    parentFolderId = OTHER_BOOKMARKS_FOLDER;
    console.log(`Select Other bookmark folder`);
  };

  proceedBtn.onmouseenter = function(ev){
    proceedBtn.classList.add("proceed-btn-urge");
  }
  proceedBtn.onmouseleave = function(ev){
    proceedBtn.classList.remove("proceed-btn-urge");
  }
  
  proceedBtn.onclick = function (ev) {
    console.log("Proceed btn clicked");
    
    /* --------------------- SHARING FROM LIST OF FOLDERS --------------------------- */
    // If user wishes to open several links together
    if (mode === GET_CURRENT_BOOKMARK_FOLDERS) {
      console.log("Supposed to display all bookmarks on load");
      let els = document.getElementsByClassName("click-folder");
      if (els.length > 0){
        els[0].classList.remove("click-folder");
      }
      if (typeof chosenId !== 'undefined'){
        nSelectedFolder = 0;

        copyTextToClipboard(urlsToShareString);
        if (urlsToShareString.length > 0 ){
          alert("Copied all LINKS to clipboard, Folders were ignored");
        }
      }
      else{
        alert("Please select a folder first");
      }
    }
    
    
    /* ---------------------------- OPEN AS TABS ------------------------------------ */
    
    else if (mode === OPEN_AS_TABS) {
      var unparsedUrlsToOpen = urlTextArea.value;
      var parsedUrlsToOpen = unparsedUrlsToOpen.split("\n");
      if (unparsedUrlsToOpen.length > 0) {
        for (i = 0; i < parsedUrlsToOpen.length; i++) {
          website = parsedUrlsToOpen[i];
          console.log("Opening new tab with: ", website);
          chrome.tabs.create({ 'url': website });
        }
      }
    }
    /* ---------------------------- SAVE TO FOLDER ----------------------------------- */
    
    else if (mode === SAVE_URLS_TO_BOOKMARK_FOLDER) { // If Create a folder was selected
      var unparsedUrlsToOpen = urlTextArea.value;
      if (unparsedUrlsToOpen.length > 0) {
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
        }, createUrlsWithinNewFolder);        
      }
      let target = parentFolderId == BOOKMARKS_BAR ? 'bookmarks bar' : 'other bookmarks folder';
      alert(`${parsedUrlsToOpen.length.toString()} links were saved to a folder named ${newFolderNameInput.value.toString()} in the ${target}.`)
    }
  }
})

function createUrlsWithinNewFolder(newBookmarkFolder, listOfLinks) {
  console.log("added bookmark folder with name: " + newBookmarkFolder.title);
  console.log("In general, the bookmark object is this: ", newBookmarkFolder);
  console.log(`listOfLinks: ${listOfLinks}`)
  linksToSaveList.forEach((link) => {
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

function onFetchBookmarkSuccess(bookmarks) {
  bookmarks.forEach(element => {
    console.log(element);
    chrome.bookmarks.getChildren(element.id, onGetChildrenSuccess);
  });
}

function onGetChildrenSuccess(children) {
  children.forEach((child) => {
    if (child.url == null) {
      console.log(`Found folder: ${child.title}`)
      foldersDict[child.id] = child.title;
    }
  });
  if(!loadedFolders){
    loadedFolders = true;
    generateFolders(foldersDict);
  }
}
function generateFolders(foldersDict){
  let availableFoldersDiv = document.getElementById("folderDivId")
  let unorderedList = document.createElement("ul");
  unorderedList.id = "listOfFoldersId";
  
  console.log(foldersDict.length);
  for (var key in foldersDict){
    let elem = document.createElement("li");
    elem.innerHTML = foldersDict[key];
    elem.value = key;
    elem.classList.add("folder");
    elem.onmouseenter = function(){
      elem.classList.add("hover-folder")
    };
    elem.onmouseleave = function(){
      elem.classList.remove("hover-folder")
    };
    elem.onclick = function(ev){
      console.log(`Getting links for folder ${this.innerHTML} this is the key: ${this.value}`);
      if (nSelectedFolder == 0){
        elem.classList.add("click-folder");
        nSelectedFolder += 1;
      }
      else {
        let els = document.getElementsByClassName("click-folder");
        els[0].classList.remove("click-folder");
        elem.classList.add("click-folder");
      }
      chosenId = this.value.toString();
      chrome.bookmarks.getChildren(chosenId, selectedFolderToShare);
    };
    
    unorderedList.appendChild(elem);
  };
  availableFoldersDiv.appendChild(unorderedList);
}

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");
  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;
  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);
  //Select all the text!
  copyFrom.select();
  //Execute command
  document.execCommand('copy');
  //(Optional) De-select the text using blur(). 
  copyFrom.blur();
  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

function selectedFolderToShare(children){
  
  for (i = 0; i < children.length; i++ ){
    if (typeof children[i].url === 'undefined'){ //Indicates it is another folder
      chrome.bookmarks.getChildren(children[i].id, selectedFolderToShare);
      continue;
    }
    if (i < children.length - 1){
      urlsToShareString += children[i].url + '\n';
    }
    else urlsToShareString += children[i].url;
  };
  console.log(`Final string is: ${urlsToShareString}`)
};
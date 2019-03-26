// The onClicked callback function.
function onClickHandler(info, tab) {
    if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
        console.log("radio item " + info.menuItemId +
            " was clicked (previous checked state was " +
            info.wasChecked + ")");
    } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
        console.log(JSON.stringify(info));
        console.log("checkbox item " + info.menuItemId +
            " was clicked, state is now: " + info.checked +
            " (previous state was " + info.wasChecked + ")");

    } else {
        console.log("item " + info.menuItemId + " was clicked");
        console.log("info: " + JSON.stringify(info));
        console.log("tab: " + JSON.stringify(tab));
    }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // Create one test item for each context type.
    var contexts = ["page", "selection"];
    // for (var i = 0; i < contexts.length; i++) {
    //     var context = contexts[i];
    //     var title = "Test '" + context + "' menu item";
    //     var id = chrome.contextMenus.create({
    //         "title": title, "contexts": [context],
    //         "id": "context" + context
    //     });
    //     console.log("'" + context + "' item:" + id);
    // }

    // Create a parent item and two children.
    chrome.contextMenus.create({ "title": "Sharing", "id": "Sharing" });
    chrome.contextMenus.create({ "title": "A bookmark folder", "parentId": "Sharing", "id": "shareBookmarkFolder" });
    chrome.contextMenus.create({ "title": "All active tabs in session", "parentId": "Sharing", "id": "shareAllActiveTabs" });
});

// var extensionMenu = {
//     title: "Share this site",
//     id: "bookmarkSharing",
//     contexts: ["selection"]
// };

// chrome.contextMenus.create(extensionMenu);
window.addEventListener("mouseup", selectText);

function selectText(message) {
    let selectedText = window.getSelection().toString();

    if (selectedText.length > 0){
        let message = {
            text: selectedText
        }
        
        if (message !== undefined){
            chrome.runtime.sendMessage(message);
        }
    }
}
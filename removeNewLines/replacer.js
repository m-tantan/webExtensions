console.log("Replacer up and running");

window.addEventListener("mouseup", selectText);

function selectText(message) {
    let selectedText = window.getSelection().toString();
    console.log(selectedText);
    if (selectedText.length > 0){
        let message = {
            text: selectedText
        }
        if (message !== undefined){
            chrome.runtime.sendMessage(message);
            console.log(("sent message: ", message.text));
        }
    }
}
console.log("Background script up and running");

chrome.runtime.onMessage.addListener(receiver);

window.selectedText = "";

function receiver(request, sender, response){
    console.log(request["text"]);
    
    let processedText = transformText(request["text"]);
    
    window.selectedText = processedText;
}

function transformText(textToProcess){
    var processedText = textToProcess.replace("\n", " ");
    return processedText;
}
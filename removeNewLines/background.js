chrome.runtime.onMessage.addListener(receiver);

window.selectedText = "";

function receiver(request, sender, response){
    
    let processedText = transformText(request["text"]);
    
    window.selectedText = processedText;
}

function transformText(textToProcess){
    var processedText = textToProcess.replace("\n", " ");
    return processedText;
}
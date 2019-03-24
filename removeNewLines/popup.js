
let bgPage = chrome.extension.getBackgroundPage();
let textToEdit =  bgPage.selectedText;
console.log(textToEdit);


document.addEventListener('DOMContentLoaded', function(event) {
    console.log(document.body);
    let elem = document.createElement("P");
    elem.innerHTML = textToEdit;
    console.log(elem);
    document.body.appendChild(elem);
  });






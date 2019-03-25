let bgPage = chrome.extension.getBackgroundPage();
let textToEdit =  bgPage.selectedText;


document.addEventListener('DOMContentLoaded', function(event) {
    let elem = document.createElement("P");
    elem.innerHTML = textToEdit;
    elem.classList.add("text_class");
    document.body.appendChild(elem);
  });






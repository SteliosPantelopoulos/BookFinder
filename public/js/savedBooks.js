const url = "http://localhost:3000";

window.onload= async function(){
  //get search input
  let typingTimer;
  let doneTypingInterval = 500;
  searchInput = document.getElementById('bookSearch');

  //on keyup, start the countdown
  searchInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
      if (searchInput.value) {
        typingTimer = setTimeout(searchForBook, doneTypingInterval);
      }else{
        typingTimer = setTimeout(displaySavedBooks, doneTypingInterval);
      }
  });

  displaySavedBooks();    
}


async function searchForBook() {
  console.log(searchInput.value);

  let responseJSON = {
    method: 'GET',
    mode: 'cors',
    headers: {
          'Accept': 'application/json'
    }
  };
  let response = await fetch(url + "/api/books/search=" + searchInput.value, responseJSON);
  let booksSaved = await response.json();

  let source = document.querySelector("#resultsTemplate").innerHTML;
  let template = Handlebars.compile(source);
  let html = template(booksSaved);
  document.querySelector("#booksDiv").innerHTML = html;

  createListenersButtons();
}



async function displaySavedBooks(){
  let responseJSON = {
    method: 'GET',
    mode: 'cors',
    headers: {
          'Accept': 'application/json'
    }
  };
  let response = await fetch(url + "/api/books/", responseJSON);
  let booksSaved = await response.json();

  let source = document.querySelector("#resultsTemplate").innerHTML;
  let template = Handlebars.compile(source);
  let html = template(booksSaved);
  document.querySelector("#booksDiv").innerHTML = html;

  createListenersButtons();
}

function createListenersButtons(){
  let element = document.getElementsByClassName("deleteButton");
  for ( let i=0; i< element.length; i++){
    element[i].addEventListener("click", function(){
      let bookId = JSON.parse(document.getElementById(this.id).value).id;
      deleteBook(bookId);
    });
  }

  element = document.getElementsByClassName("settingsButton");
  for (i=0; i< element.length; i++){
    element[i].addEventListener("click", function(){
      settingId = "settings" + this.id;
      bookId = JSON.parse(document.getElementById(this.id).value).id;
      updateBook(bookId);
    });
  }
}
  
async function deleteBook(bookId){
  let responseJSON = {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let response = await fetch(url + "/api/books/" + bookId, responseJSON);

  getStatus(response);

  displaySavedBooks();

}

async function updateBook(bookId){
  localStorage.setItem("id",bookId);
  window.location.href = "savedBookUpdate.html";
}



async function getStatus(response){
  let statusResponse = await response.json();
  console.log(statusResponse.msg);
}
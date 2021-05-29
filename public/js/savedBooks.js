const url = "http://localhost:3000";

window.onload= async function(){
    displaySavedBooks();    
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
  let booksSaved = (await response.json()).books;
  let worksDataJSON = '{"work": [] }';
  let obj = JSON.parse(worksDataJSON);

  for(book in booksSaved){
      obj["work"].push({"author": booksSaved[book].author, "title": booksSaved[book].title, "id": booksSaved[book].id});
  }
  let source = document.querySelector("#resultsTemplate").innerHTML;
  let template = Handlebars.compile(source);
  let html = template(obj);
  document.querySelector("#booksDiv").innerHTML = html;

  createListenersDeleteButtons();
}

function createListenersDeleteButtons(){
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
      bookId = JSON.parse(document.getElementById(this.id).value).id;
      //TODO GET DATA FROM USER
      newData = {
        author:"Mpampis",
        title: "Test"
      };
      updateBook(bookId, JSON.stringify(newData));
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
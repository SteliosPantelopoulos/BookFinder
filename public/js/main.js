const urlAuthor = "https://reststop.randomhouse.com/resources/authors?lastName=";
const urlWork = "https://reststop.randomhouse.com/resources/works?search=";
const urlWorkId = "https://reststop.randomhouse.com/resources/works/";

const url = "http://localhost:3000";


window.onload =function() {
  //initialise event listeners for search and reset buttons
  authorInput = document.getElementById("authorSearch");
  titleInput = document.getElementById("titleSearch");

  let button = document.getElementById('buttonSearch');
  button.addEventListener("click", getInputs);  

  let reset = document.getElementById('resetFields');
  reset.addEventListener("click", () => {authorInput.value = ""; titleInput.value = "";});
}

function getInputs(){
  if(authorInput.value != ""){
    console.log("Search for author: " + authorInput.value);
    searchAuthor(authorInput.value);
  }else if(titleInput.value != ""){
    console.log("Search for book's title: " + titleInput.value);
    searchTitle(titleInput.value);
  }else{
    console.log("No search field");
  }
}

async function searchAuthor(authorName){
  //fetch with api and request all books of the given author
  let responseJSON = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
  let response = await fetch(urlAuthor + authorName, responseJSON);
  let booksReceived = {books: []};

  if(response.ok){
    let authorsList = (await response.json()).author;
    if(authorsList != null){
      //there are authors with this name
      for(let author in authorsList){
        //for every author
        let authorWorks = authorsList[author].works;
        if(authorWorks != null){
          if(Array.isArray(authorWorks.works)){
            //has multiple books
            for(let work in authorWorks.works){
              let workData = await searchWorkId(authorWorks.works[work]);
              booksReceived["books"].push({"author": workData.authorweb,"title": workData.titleshort, "id": workData.workid});
            }
          }else{
            //has one book
            let workData = await searchWorkId(authorWorks.works);
            booksReceived["books"].push({"author": workData.authorweb,"title": workData.titleshort, "id": workData.workid});
          }
        }
      }
    }else{
      //no authors with this name
      console.log("No authors found with name: " + authorName)
    }
    
  }

  //loads author name and number of results in html page
  let source = document.querySelector("#searchTypeTemplate").innerHTML;
  let template = Handlebars.compile(source);
  let searchType = {"authorname": authorName, "authorSearch": true, "results": booksReceived.books.length};
  let html = template(searchType);
  document.querySelector("#booksDiv").innerHTML = html;
  //loads books found in html
  source = document.querySelector("#resultsTemplate").innerHTML;
  template = Handlebars.compile(source);
  html = template(booksReceived);
  document.querySelector("#booksDiv").innerHTML += html;

  createListenersButtons();
}
  
async function searchTitle(bookTitle){
  //fetch with api and request all books with the given title
  let responseJSON = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
  let response = await fetch(urlWork + bookTitle, responseJSON);
  let booksReceived = {books: []};

  if(response.ok){
    let books = (await response.json()).work;
    if(books != null){
      for(book in books){
        booksReceived["books"].push({"author": books[book].authorweb,"title": books[book].titleshort, "id": books[book].workid});
      }
    }else{
      console.log("No books found with title: " + bookTitle);
    }
    

    let source = document.querySelector("#searchTypeTemplate").innerHTML;
    let template = Handlebars.compile(source);
    let searchType = {"title": bookTitle, "authorSearch": false, "results": booksReceived.books.length};
    let html = template(searchType);
    document.querySelector("#booksDiv").innerHTML = html;


    source = document.querySelector("#resultsTemplate").innerHTML;
    template = Handlebars.compile(source);
    html = template(booksReceived);
    document.querySelector("#booksDiv").innerHTML += html;

    createListenersButtons();
  }
  
}

async function searchWorkId(bookId){
  //get request to the api for book with id given
  let responseJSON = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
  let response = await fetch(urlWorkId + bookId, responseJSON);
  if(response.ok){
    let workData = await response.json();
    return(workData);
  }
}

function createListenersButtons(){
  //create listeners for save/delete buttons
  let element = document.getElementsByClassName("addFavorites");
  for ( var i=0; i< element.length; i++){
    element[i].addEventListener("click", function(){
      let bookData = document.getElementById(this.id).value;
      if(this.checked){   
        //if unchecked save book, if checked delete book                               
        saveBook(bookData);
      }else{
        deleteBook(JSON.parse(bookData).id);
      }
    }); 
  }
}

async function saveBook(bookData){
  //create request to server to save book
  let responseJSON = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: bookData
  };
  let response = await fetch(url + "/api/books/", responseJSON);

  let statusResponse = await response.json();
  console.log(statusResponse.msg);
  if(response.status === 405){
    alert("Book already saved");
  }
}

async function deleteBook(bookId){
  //create delete request to server to remove book
  let responseJSON = {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let response = await fetch(url + "/api/books/" + bookId, responseJSON);
  
  let statusResponse = await response.json();
  console.log(statusResponse.msg);
}
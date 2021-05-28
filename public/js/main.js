const urlAuthor = "https://reststop.randomhouse.com/resources/authors?lastName=";
const urlWork = "https://reststop.randomhouse.com/resources/works?search=";
const urlWorkId = "https://reststop.randomhouse.com/resources/works/";

const url = "http://localhost:3000";


window.onload =function() {
  authorInput = document.getElementById("authorSearch");
  titleInput = document.getElementById("titleSearch");

  const button = document.getElementById('buttonSearch');
  button.addEventListener("click", getInputs);  

  const reset = document.getElementById('resetFields');
  reset.addEventListener("click", resetInputs);
}


function createListenersButtons(){
  let element = document.getElementsByClassName("addFavorites");
  for ( var i=0; i< element.length; i++){
    element[i].addEventListener("click", function(){
      let bookData = document.getElementById(this.id).value;
      
      if(this.checked){                                  //if unchecked save book, if checked delete book
        saveBook(bookData);
      }else{
        deleteBook(JSON.parse(bookData).id);
      }
    }); 
  }
}

async function saveBook(bookData){
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
  //create delete request to remove book
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


function getInputs(){
  if(authorInput.value != ""){
    console.log("Search for author: " + authorInput.value);
    searchAuthor(authorInput.value);
  }else if(titleInput.value != ""){
    console.log("Search for book's title: " + titleInput.value);
    searchTitle(titleInput.value);
  }else{
    console.log("Enter search field");
  }
  
}

async function searchAuthor(data){
  let responseJSON = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
  let response = await fetch(urlAuthor + data, responseJSON);

  let booksReceived = {books: []};

  if(response.ok){
    let authorsList = (await response.json()).author;
    for(let author in authorsList){
      let authorWorks = authorsList[author].works;
      if(authorWorks != null){
        if(Array.isArray(authorWorks.works)){
          for(let work in authorWorks.works){
            let workData = await searchWorkId(authorWorks.works[work]);
            booksReceived["books"].push({"author": workData.authorweb,"title": workData.titleshort, "id": workData.workid});
          }
        }else{
          let workData = await searchWorkId(authorWorks.works);
          booksReceived["books"].push({"author": workData.authorweb,"title": workData.titleshort, "id": workData.workid});
        }
      }
    }
  }

  let source = document.querySelector("#searchTypeTemplate").innerHTML;
  let template = Handlebars.compile(source);

  let searchType = {"authorname": data, "authorSearch": true};
  let html = template(searchType);
  document.querySelector("#booksDiv").innerHTML = html;

  source = document.querySelector("#resultsTemplate").innerHTML;
  template = Handlebars.compile(source);
  html = template(booksReceived);
  document.querySelector("#booksDiv").innerHTML += html;
  createListenersButtons();
}
  
async function searchTitle(data){
  let responseJSON = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
  //get data from web api
  let response = await fetch(urlWork + data, responseJSON);

  let booksReceived = {books: []};

  if(response.ok){
    let books = (await response.json()).work;

    for(book in books){
      booksReceived["books"].push({"author": books[book].authorweb,"title": books[book].titleshort, "id": books[book].workid});
    }

    let source = document.querySelector("#searchTypeTemplate").innerHTML;
    let template = Handlebars.compile(source);

    let searchType = {"title": data, "authorSearch": false};
    let html = template(searchType);
    document.querySelector("#booksDiv").innerHTML = html;


    source = document.querySelector("#resultsTemplate").innerHTML;
    template = Handlebars.compile(source);
    html = template(booksReceived);
    document.querySelector("#booksDiv").innerHTML += html;
  }
  createListenersButtons();
}

async function searchWorkId(data){
  let responseJSON = {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }
  let response = await fetch(urlWorkId + data, responseJSON);

  if(response.ok){
    let workData = await response.json();
    return(workData);
  }
}



async function getWorks(authorDetails){
  //for a list of works ids get data
  for(let work in authorDetails.works){
    let workDetails = authorDetails.works[work];
    var workData;


    //TODO handlebars in html
    if(Array.isArray(workDetails)){
      for(let x in workDetails){
        console.log("Work: " + workDetails[x]);
        workData = await searchWorkId(workDetails[x])
        console.log(workData.titleAuth);
        return work.Data;
      }
    }
    else{
      console.log("Work: " + workDetails);
      workData = await searchWorkId(workDetails);
      console.log(workData.titleAuth);
      return work.Data;
      
    }
  }
}



function resetInputs(){
  authorInput.value = "Author's lastname...";
  titleInput.value = "Book's title...";
}













//HELPING FUNCTIONS








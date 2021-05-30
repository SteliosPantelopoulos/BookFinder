const url = "http://localhost:3000";

window.onload = function(){
  //receive book id 
  const bookId = localStorage.getItem("id");
  localStorage.clear();
  
  let source = document.querySelector("#bookIdTemplate").innerHTML;
  let template = Handlebars.compile(source);
  let html = template({id: bookId});
  document.querySelector("#bookIdDiv").innerHTML = html;

  const button = document.getElementById("submitUpdates");
  authorInput = document.getElementById("authorUpdate");
  titleInput = document.getElementById("titleUpdate");
  descriptionInput = document.getElementById("descriptionUpdate");



  button.addEventListener("click", async() =>{
      let responseJSON = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({
              author: authorInput.value,
              title: titleInput.value,
              description: descriptionInput.value
          })
        }
      let response = await fetch(url + "/api/books/" + bookId, responseJSON);
            
      let statusResponse = await response.json();
      console.log(statusResponse.msg);
      window.location.href = "savedBooks.html";
    })
}
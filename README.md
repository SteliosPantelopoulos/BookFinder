# BookFinder

BookFinder is a Web Development Project that implements a website where the user can search for a book, save it in his favourites list and edit it's information.  
Built using the WEB API: Penguin Random House http://www.penguinrandomhouse.biz/webservices/rest/.

## Use cases

- Search for a book by title or author.
- Save book / books to favorites.
- Edit the data of each saved book.
- Search for a book in the favorites list.

## Design details

- *Architecture* : the application is based on the Client-Server architecture.  
  * The Client side is implemented as a set of HTML pages that incorporate vanilla JavaScript code.  
  * The server side is implemented as a Node.js application, which is called by
  the Customer via appropriate hyperlinks or HTTP requests using the Fetch API.  

- *Libraries / frameworks* :  
  * For the customer side: Fetch API and Handlebars library.  
  * For the server side: Node.js API, Express framework and Handlebars library.  
                              
- *Database* : MongoDB

## How to run application

Open project from Visual Studio Code run ``nodemon index.js`` command, then open index.html file from your browser

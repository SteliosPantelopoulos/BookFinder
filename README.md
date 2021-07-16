# BookFinder

BookFinder is a Web Development Project that implements a website where the user can search for a book, save it in his favourites list and edit it's information.  
Built using the WEB API: Penguin Random House http://www.penguinrandomhouse.biz/webservices/rest/.

![Main Page of BookFinder](/assetsREADME/mainPage.png "BookFinder")

In the main page as seen above the user can search for one or more books by entering the book's title or the book's author.

![Search fields](/assetsREADME/searchBooks.png "Search for author with name Brown")

When the search button is pressed the client makes a request to the WEB API and displays the results.

![Search results](/assetsREADME/searchBooksResults.png "Books with author name Brown")

The user then can save any of the books displayed and can access them in the Saved Books page.

![Saved Books](/assetsREADME/savedBooks.png "List of saved books")

In the Saved Books page the user can delete, edit or search in the saved books list.

![Saved Books Edit](/assetsREADME/savedBooksEdit.png "Edit the information of a book")

![Saved Books Search](/assetsREADME/savedBooksSearch.png "Search for LO in saved books")


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

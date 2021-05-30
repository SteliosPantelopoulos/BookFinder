const express = require('express');
const router = express.Router();
books = require("../booksSaved");


//search book
router.get('/search=:searchString', (req,res) =>{
    //search if a string is included in a book's title or author
    //returns all the books with this property, else returns 404 status
    console.log(`Search request for ${req.params.searchString}`);
    booksWithField = [];
    books.forEach(book => {
        if(book.title.includes(req.params.searchString) || book.author.includes(req.params.searchString)){
            booksWithField.push(book)
        }
    })

    if(booksWithField.length > 0){
        res.status(200).json({
            msg: `Returned all books that contain ${req.params.searchString}`,
            books: booksWithField
        })
    }else{
        res.status(404).json({msg: `No books that contain ${req.params.searchString}`})
    }
});

//get all books
router.get('/', (req, res) => {
    //returns all books saved by user, else returns 404 status
    console.log("Get request for all books");

    if(books.isEmpty){
        res.status(404).json({msg : "No books saved"});
    }else{
        res.status(200).json({
            msg: "Returned all books",
            books: books
        })
    }
});

//get individual book
router.get('/:id', (req,res) =>{
    //returns book with id given in link, else returns 404 status
    console.log(`Get request for book with id ${req.params.id}`)
    let found = books.some(book => book.id === parseInt(req.params.id));

    if(found){
        res.status(200).json({
            msg: `Return book ${req.params.id}`,
            books: books.filter(book => book.id === parseInt(req.params.id) )
        });
    }else{
        res.status(404).json({msg: `Book ${req.params.id} not found in saved books`});
    }  
});
 
//add book
router.post('/', (req, res) =>{
    //posts a new book with attrubutes given in a json
    //returns error code if an attribute is not given or if book is already saved
    //else returns updated books list
    console.log("Post request add book")
    let newBook = {
         id: parseInt(req.body.id),
         title: req.body.title,
         author: req.body.author,
         description: ""
    };

    //check if every attribute is given
    if(!newBook.id || !newBook.title || !newBook.author){
        return res.status(404).json({msg: "Please include book id, author and title"});
    }
    //check if book already exists in savedBooks
    let found = books.some(book => book.id === newBook.id);

    if(found){
        return res.status(405).json({msg: `Book ${newBook.id} already saved` });
    }

    books.push(newBook);
    res.status(201).json({
        msg: `Book ${newBook.id} added`,
        books: books
    });
});

//update book
router.post('/:id', (req,res) =>{
    //update the attributes of the book given in link
    //returns updated books list, else returns status 404
    console.log(`Post request update book with id ${req.params.id}`)
    let found = books.some(book => book.id === parseInt(req.params.id));

    if(found){
        let updBook = req.body;
        books.forEach(book =>{
            if(book.id === parseInt(req.params.id)){
                //if attribute is given then update else keep old value
                if(updBook.title != ""){book.title = updBook.title}
                if(updBook.author != ""){book.author = updBook.author }
                if(updBook.description != ""){book.description = updBook.description}

                res.status(200).json({
                    msg: `Book ${req.params.id} was updated`, 
                    books: books
                });
            }
        })
    }else{
        res.status(404).json({msg: `Book ${req.params.id} not found in saved books`});
    }  
});

//delete book
router.delete('/:id', (req,res) =>{
    //remove book from list
    console.log(`Delete request for book with id ${req.params.id}`)
    let found = books.some(book => book.id === parseInt(req.params.id));

    if(found){
        books = books.filter(book => book.id !== parseInt(req.params.id))
        res.status(200).json({
            msg: `Book ${req.params.id} deleted`, 
            books: books
        });
    }else{
        res.status(404).json({msg: `Book ${req.params.id} not found`});
    }  
})


module.exports = router;
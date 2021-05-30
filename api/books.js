const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const Book = require('../models/book');

//connect to database 
const durl = "mongodb+srv://user:user2021@webdevelopmentproject.jijoh.mongodb.net/savedBooks?retryWrites=true&w=majority"

mongoose.connect(durl, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => console.log("connected to database"))
.catch((error) => console.log(error))

//search book
router.get('/search=:searchString', (req,res) =>{
    //search if a string is included in a book's title or author
    //returns all the books with this property, else returns 404 status
    console.log(`Search request for ${req.params.searchString}`);

    Book.find()
    .then(booksSaved => {
        booksWithField = [];
        
        booksSaved.forEach(book => {
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
    })
    .catch( () =>{
        res.status(404).json({msg: "Error with database"});
    }) 
});

//get all books
router.get('/', (req, res) => {
    //returns all books saved by user, else returns 404 status
    console.log("Get request for all books");
    
    Book.find()
    .then(booksSaved => {
        if(booksSaved.isEmpty){
            res.status(404).json({msg : "No books saved"});
        }else{
            res.status(200).json({
                msg: "Returned all books",
                books: booksSaved
            })
        }
    })
    .catch( () =>{
        res.status(404).json({msg: "Error with database"});
    })
});

//get individual book
router.get('/:id', (req,res) =>{
    //returns book with id given in link, else returns 404 status
    console.log(`Get request for book with id ${req.params.id}`)

    Book.findById(req.params.id)
    .then(result => {
        
        res.status(200).json({
            msg: `Return book ${req.params.id}`,
            books: result
        });
    })
    .catch( () =>{
        res.status(404).json({msg: `Book ${req.params.id} not found in saved books`});
    })
});
 
//add book
router.post('/', (req, res) =>{
    //posts a new book with attrubutes given in a json
    //returns error code if an attribute is not given or if book is already saved
    //else returns updated books list
    console.log("Post request add book")
    let newBook = new Book({
        id: parseInt(req.body.id),
        title: req.body.title,
        author: req.body.author,
        description: ""
    });

    //check if every attribute is given
    if(!newBook.id || !newBook.title || !newBook.author){
        return res.status(404).json({msg: "Please include book id, author and title"});
    }
    let found = false;
    Book.find()
    .then(booksSaved => {
        booksSaved.forEach(book => {
            if(book.id === newBook.id){
                found = true;
            }
        })
        if(found){
            res.status(405).json({msg: `Book ${newBook.id} already saved` });
        }else{
            newBook.save()
            .then(() => {
                res.status(201).json({
                    msg: `Book ${newBook.id} added`,
                    books: booksSaved
                });
            })
        }
    })
    .catch( () =>{
        res.status(404).json({msg: "Error with database"});
    })   
});

//update book
router.post('/:id', (req,res) =>{
    //update the attributes of the book given in link
    //returns updated books list, else returns status 404
    console.log(`Post request update book with id ${req.params.id}`);

    let updBook = req.body;
    let update = {};
    if(updBook.title != ""){update.title = updBook.title;}
    if(updBook.author != ""){update.author = updBook.author }
    if(updBook.description != ""){update.description = updBook.description}


    Book.findOneAndUpdate({_id: req.params.id}, update)
    .then(() =>{
        res.status(200).json({
            msg: `Book ${req.params.id} was updated`, 
            books: books
        });
    })
    .catch( () => {
        res.status(404).json({msg: `Book ${req.params.id} not found in saved books`});
    })
 
});

//delete book
router.delete('/:id', (req,res) =>{
    //remove book from list
    console.log(`Delete request for book with id ${req.params.id}`)
    if(req.params.id.match(/^[0-9]+$/) == null){
        Book.findByIdAndDelete(req.params.id)
        .then( () =>{
            res.status(200).json({
                msg: `Book ${req.params.id} deleted`
            }); 
        })
        .catch(() =>{
            res.status(404).json({msg: `Book ${req.params.id} not found`});
        })
    }else{
        //called from main page dbId is not known
        Book.find()
        .then(booksSaved => {
            booksSaved.forEach(book => {
                if(book.id === parseInt(req.params.id)){
                    Book.findByIdAndDelete(book._id)
                    .then( () =>{
                        res.status(200).json({
                            msg: `Book ${req.params.id} deleted`
                        }); 
                    })
                    .catch(() =>{
                        res.status(404).json({msg: `Book ${req.params.id} not found`});
                    })
                }
            })
        })
        .catch( () =>{
            res.status(404).json({msg: "Error with database"});
        })
    }
    
    
})


module.exports = router;
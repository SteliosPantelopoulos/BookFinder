const express = require('express');
const router = express.Router();
books = require("../booksSaved"); //DAO


//get all books
router.get('/', (req, res) => {
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
    console.log(`Get request for book with id ${req.params.id}`)

    const found = books.some(book => book.id === parseInt(req.params.id));
    if(found){
        res.status(200).json({
            msg: `Return book ${req.params.id}`,
            books: books.filter(book => book.id === parseInt(req.params.id) )
        });
    }else{
        res.status(404).json({msg: `Book ${req.params.id} not found in saved books`});
    }  
})
 

//add book
router.post('/', (req, res) =>{
    console.log("Post request add book")
    const newBook = {
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
    const found = books.some(book => book.id === newBook.id);

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
    console.log(`Post request update book with id ${req.params.id}`)
    const found = books.some(book => book.id === parseInt(req.params.id));

    if(found){
        const updBook = req.body;
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
})


//delete book
router.delete('/:id', (req,res) =>{
    console.log(`Delete request for book with id ${req.params.id}`)
    const found = books.some(book => book.id === parseInt(req.params.id));

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
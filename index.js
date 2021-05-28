const express = require("express");
const app = express();
const exphbs = require('express-handlebars'); 
const port = 3000
const path = require('path');
const logger = require("./logger");
const books = require('./booksSaved');
const cors = require('cors');

app.listen(port);

app.use(cors());

// //set static folder
app.use(express.static(path.join(__dirname, '/public')));

// //set views
// app.set("views", path.join(__dirname, 'views'));
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');


// app.get('/savedBooks', (req, res) =>{
//     res.render('savedBooks', {pageName: 'savedBooks', books: books});
// })

//initialise middleware
app.use(logger);

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//set static folder


//members API routes
app.use('/api/books', require('./api/books'))

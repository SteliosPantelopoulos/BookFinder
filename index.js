const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors');

app.listen(port);
app.use(cors());

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//members API routes
app.use('/api/books', require('./api/books'))

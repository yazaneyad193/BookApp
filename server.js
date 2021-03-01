'use strict';
const { log, error } = require('console');
const express = require('express');
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');



const PORT = process.env.PORT || 8000;
const server = express();
server.use(cors());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
// to tell the express, we want to use ejs template engine
server.set('view engine', 'ejs');

// localhost:3000/
server.get('/', (req, res) => {
    let SQL = `SELECT * FROM books;`;

    client.query(SQL)
        .then(result => {
            // console.log(result.rows);
            res.render('pages/index', { books: result.rows, rowsNumber: result.rowCount })
        })


    //res.render('pages/index');
})

server.get('/details/:id', (req, res) => {

    let id = req.params.id;
    let SQL = `SELECT * FROM books WHERE id=$1`;
    let values = [id];
    client.query(SQL, values).then(data => {
        res.render('./pages/books/detail', { book: data.rows[0] });
    })
        .catch(e => { errorHandler('Error while getting the data from DB' + e, req, res) });


});


/////////////// error handler
// server.use('*',(req,res)=>{
//     res.status(500).send('Sorry something went wrong')
// })

server.get('/searches', (req, res) => {
    res.render('pages/searches/new.ejs')
})


server.post('/book', (req, res) => {
    let { url, title, author, isbn, description } = req.body;
    let SQL = `INSERT INTO books (author,title,isbn,image_url,description) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    let safeValues = [author, title, isbn, url, description];
    client.query(SQL, safeValues).then(data => {
        let id = data.rows[0].id;
        res.redirect(`/books/${id}`);

    })
    // .catch(e => { errorHandler('Error while getting the data which inserted to The Data Base ' + e, req, res) });
})

server.post('/searches/new', searchHandler);

function searchHandler(req, res) {
    let title = req.body.search
    let intitle = req.body.intitle
    let url;
    if (intitle !== undefined) {
        url = `https://www.googleapis.com/books/v1/volumes?q=${title}+intitle:${title}&startIndex=0&maxResults=10`
    } else {
        url = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${title}&startIndex=0&maxResults=10`
    }
    superagent.get(url)
        .then(books => {
            let booksArray = books.body.items.map(book => new Books(book));
            res.render('pages/searches/show', { books: booksArray });
        })
}

let savedBooks = [];
function Books(data) {
    this.title = data.volumeInfo.title
    this.author = data.volumeInfo.authors
    this.img = data.volumeInfo.imageLinks.thumbnail || 'https://i.imgur.com/J5LVHEL.jpg';
    this.discription = data.volumeInfo.discription;
}
console.log(savedBooks);



client.connect()
    .then(() => {
        server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
    })

'use strict';
//const { log, error } = require('console');
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
const methodOverride = require('method-override');
server.use(methodOverride('_method'));

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
            //Inst a route is a view .
            res.render('pages/index', { books: result.rows, rowsNumber: result.rowCount })
        })
    //res.render('pages/index');
})
server.get('/searches/new', (req, res) => {
    res.render('pages/searches/new')
})
server.post('/searches', searchHandler);

function searchHandler(req, res) {
    let search = req.body.search;
    // console.log(search);
    let choice = req.body.choice;
    let url;
    if (choice === 'title') {
        url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${search}`
    } else {
        url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${search}`
    }
    superagent.get(url)
        .then(books => {

            let booksArray = books.body.items.map(book => new Books(book));
            // console.log(booksArray)
            res.render('pages/searches/show', { books: booksArray });
        })
}
server.get('/books/:id', (req, res) => {

    let SQL = `SELECT * FROM books WHERE id=$1`;
    let values = [req.params.id];
    client.query(SQL, values).then(data => {
        res.render('pages/books/detail', { book: data.rows[0] });
    })
    //   .catch(e => { errorHandler('Error while getting the data from DB' + e, req, res) });
});






server.post('/addBook', (req, res) => {
    //console.log(req.body);
    // let { author, title, image_url, description } = req.body;
    let value = req.body;

    let SQL = `INSERT INTO books (author,title,isbn,image_url,description) VALUES($1 , $2, $3, $4, $5) RETURNING id;`;
    let safeValues = [value.author, value.title, value.isbn, value.image_url, value.description];
    client.query(SQL, safeValues).then(data => {
        console.log(data.rows[0].id);
        res.redirect(`/books/${data.rows[0].id}`);

    })
    //.catch(e => { errorHandler('Error while getting the data which inserted to The Data Base ' + e, req, res) });
})


server.put('/updateBook/:id', updateBookHandler);

function updateBookHandler(req, res) {
    //console.log(req.body);
    let { author, title, isbn, image_url, description } = req.body;
    //let { image_url, title, author, isbn, description } = req.body;
    let id = req.params.id;
    let SQL = `UPDATE books SET author=$1,title=$2,isbn=$3,image_url=$4,description=$5 WHERE id=$6;`
    let safeVales = [author, title, isbn, image_url, description, id];
    client.query(SQL, safeVales).then(() => {
        res.redirect(`/details/${id}`);
    })

}
server.delete('/deleteBook/:id', deleteBookHandler);

function deleteBookHandler(req, res) {
    let id = req.params.id;
    let SQL = `DELETE FROM books WHERE id=$1;`;
    let value = [req.params.taskID];
    client.query(SQL, value)
        .then(() => {
            res.redirect('/');
        })
}

function Books(bookData) {
    this.image_url = (bookData.volumeInfo.imageLinks) ? bookData.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    this.title = bookData.volumeInfo.title || 'no title available for this Book';
    this.author = (bookData.volumeInfo.authors) ? bookData.volumeInfo.authors : 'no Author';
    this.description = bookData.volumeInfo.description || 'no description';
    this.isbn = (bookData.volumeInfo.industryIdentifiers && bookData.volumeInfo.industryIdentifiers[0].type + '' +
        bookData.volumeInfo.industryIdentifiers[0].identifier) || 'No ISBN';
    // this.title = (data.volumeInfo.title) ? data.volumeInfo.title : `Title unavilable`;
    // this.author = (Array.isArray(data.volumeInfo.authors)) ? data.volumeInfo.authors.join(', ') : `Unknown Author`;
    // this.description = (data.volumeInfo.description) ? data.volumeInfo.description : `description unavilable`;
    // //this.img = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
    // if (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) {
    //     this.image_url = data.volumeInfo.imageLinks.thumbnail;
    // } else {
    //     this.image_url = "https://i.imgur.com/J5LVHEL.jpg";
    // }


    // this.isbn = (data.volumeInfo.industryIdentifiers) ? data.volumeInfo.industryIdentifiers[0].identifier : `Unknown ISBN`;
    //this.shelf = (data.volumeInfo.categories) ? data.volumeInfo.categories : `The book is not in a shelf`;
}
//console.log(savedBooks);



client.connect()
    .then(() => {
        server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
    })

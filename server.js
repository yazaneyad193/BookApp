// 'use strict';

// const express = require('express');
// require('dotenv').config();
// const superagent = require('superagent');


// const PORT = process.env.PORT || 3000;
// const app = express();

// app.use(express.static('./public'));
// app.use(express.urlencoded({ extended: true }));

// // to tell the express, we want to use ejs template engine
// app.set('view engine', 'ejs');

// // localhost:3000/
// app.get('/home', (req, res) => {
//     // res.send('hello');
//     res.render('pages/index');
// })


// // localhost:3000/pages/searches/new.ejs
// app.get('/search', (req, res) => {
//     // res.send('hello New');
//     res.render('pages/searches/new.ejs');
// })

// app.get('/searches', (req, res) => {

//     let title = req.query.search;
//     let inAuthor = req.query.inauthor;
//     let url = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${title}`
// });

// // // localhost:3000/listFamily
// // app.get('/listFamily', (req, res) => {

// //     let people = ['atallah', 'mesina', 'razan', 'ali', 'sherry'];
// //     res.render('list', { familyMembers: people });
// // })

// // app.get('/books', (req, res) => {
// //     // get books from google api server
// //     let url = `https://www.googleapis.com/books/v1/volumes?q=cats`;
// //     superagent.get(url)
// //         .then(booksResult => {
// //             console.log(booksResult.body);
// //             // res.send(booksResult.body);
// //             res.render('booksList', { catLists: booksResult.body.items })
// //         })
// // })

// app.listen(PORT, () => {
//     console.log(`Listening on PORT ${PORT}`);
// })

'use strict';
const { log, error } = require('console');
const express = require('express');
require('dotenv').config();
const superagent = require('superagent');

const cors = require('cors');



const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());
server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));

// to tell the express, we want to use ejs template engine
server.set('view engine', 'ejs');

// localhost:3000/
server.get('/', (req, res) => {
    res.render('pages/index');
})


/////////////// error handler
// server.use('*',(req,res)=>{
//     res.status(500).send('Sorry something went wrong')
// })

server.get('/search', (req, res) => {
    res.render('pages/searches/new.ejs')
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
}
console.log(savedBooks);

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
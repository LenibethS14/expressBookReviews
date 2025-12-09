const express = require('express');
//const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {

    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
   
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //res.send(JSON.stringify({books}, null, 4));

    let promiseBooks = new Promise((resolve, reject) => {
        if (books && Object.keys(books).length > 0) {
            resolve(books); 
        } else {
            reject("No books found"); // reject if books object is empty
        }
    });

    promiseBooks
        .then((bookData) => {
            res.status(200).send(JSON.stringify(bookData, null, 4));
        })
        .catch((error) => {
            res.status(500).json({ message: "Error getting the books", error });
        });
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    /*const found = books[isbn];
    if (found) {
        res.send(JSON.stringify(found, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }*/

    let promiseBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); // Book found
        } else {
            reject("Book not found"); // ISBN not in books
        }
    });

    promiseBook
        .then((book) => {
            res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    /* const bookKeys = Object.keys(books);
    const results = [];
    bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            results.push({ isbn: key, ...books[key] });
        }
    });
    if (results.length > 0) {
        return res.send(JSON.stringify(results, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    } */
    let promiseAuthor = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const results = [];

        bookKeys.forEach(key => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                results.push({ isbn: key, ...books[key] });
            }
        });

        if (results.length > 0) {
            resolve(results); // Found books
        } else {
            reject("No books found for this author"); // Nothing found
        }
    });

    // Handle Promise
    promiseAuthor
        .then((booksByAuthor) => {
            res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    /*const bookKeys = Object.keys(books);
    const results = [];

    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            results.push({ isbn: key, ...books[key] });
        }
    });

    if (results.length > 0) {
        return res.send(JSON.stringify(results, null, 4));
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }*/
    let promiseTitle = new Promise((resolve, reject) => {
        const bookKeys = Object.keys(books);
        const results = [];

        bookKeys.forEach(key => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                results.push({ isbn: key, ...books[key] });
            }
        });

        if (results.length > 0) {
            resolve(results); // Found books
        } else {
            reject("No books found with this title"); // Nothing found
        }
    });

    // Handle Promise
    promiseTitle
        .then((booksByTitle) => {
            res.status(200).send(JSON.stringify(booksByTitle, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const found = books[isbn];
    if (found) {
        res.send(JSON.stringify(found.reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }


});

module.exports.general = public_users;

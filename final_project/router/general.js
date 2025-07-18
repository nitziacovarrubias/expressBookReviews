const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require("axios");
const public_users = express.Router();

const doesExist = username => {
    const usersWithUsername = users.filter(user => user.username === username);
    if(usersWithUsername.length > 0) {
        return true;
    }
    return false;
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(!doesExist(username)) {
            users.push({username, password});
            return res.status(200).json({message: "User successfully registered. Now you can log in"});
        }
        return res.status(404).json({message: "User already exists!"})
    }
    return res.status(404).json({message: "Unable to register user"})
});

// Get the book list available in the shop
/*
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});
*/

// Fetching books with promises
function getBooksAsync() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(books);
        }, 500);
    });
}

public_users.get('/', async (req, res) => {
    try {
        const response = await getBooksAsync();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({message: "Error fetching the data", error})
    }
});

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if(book) {
        return res.status(200).json(book);
    }
    return res.status(404).json({message: `Book not found with isbn ${req.params.isbn}`});
});
*/

// Get book details base on ISBM using Promises
function getBookISBNAync(isbn) {
    return new Promise(resolve => {
        const book = books[isbn];
        resolve(book);
    });
}

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await getBookISBNAync(req.params.isbn);
        if (response) {
            return res.status(200).json(response);
        }
        return res.status(404).json({message: `Book not found with isbn ${req.params.isbn}`});
    } catch (error) {
        return res.status(404).json({message: "Error fetching the data", error})
    }
});

// Get book details based on author
/*
public_users.get('/author/:author', (req, res) => {
  Object.keys(books).forEach(isbn => {
    if(books[isbn]["author"] === req.params.author) {
        return res.status(200).json({message: "Book found", book:books[isbn]});
    }
  })
  return res.status(404).json({message: "Book with the specified author not found"});
});
*/

// Get book details base on author with Promises
function getBooksAsync(author) {
    return new Promise(resolve => {
        Object.keys(books).forEach(isbn => {
            if(books[isbn]["author"] === req.params.author) {
                resolve(books[isbn]);
            }
          })
          resolve(null);
    });
}

public_users.get('/author/:author', async (req, res) => {
    try {
        const response =  await getBooksAsync(req.params.author);
        if (response) {
            return res.status(200).json({message: "Book found", book:books[isbn]});
        }
        return res.status(404).json({message: "Book with the specified author not found"});
    } catch (error) {
        return res.status(404).json({message: "Error fetching the data", error})   
    }
});

// Get all books based on title
/*
public_users.get('/title/:title', (req, res) => {
    Object.keys(books).forEach(isbn => {
        if(books[isbn]["title"] === req.params.title) {
            return res.status(200).json({message: "Book found", book:books[isbn]});
        }
      })
      return res.status(404).json({message: `"${req.params.title}" not found`});
});
*/

// Get all books based on title with Promises
function getBooksAsync(title) {
    return new Promise(resolve => {
        Object.keys(books).forEach(isbn => {
            if(books[isbn]["title"] === req.params.title) {
                resolve(books[isbn]);
            }
        })
        resolve(null);
    });
};

public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await getBooksAsync(req.params.title);
        if (response) {
            return res.status(200).json({message: "Book found", book:books[isbn]});
        }
        return res.status(404).json({message: `"${req.params.title}" not found`});
    } catch (error) {
        return res.status(404).json({message: "Error fetching the data", error});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const review = books[req.params.isbn]["reviews"];
    if(review) {
        return res.status(200).json(review);
    }
    return res.status(404).json({message: `Review not found`});
});

module.exports.general = public_users;

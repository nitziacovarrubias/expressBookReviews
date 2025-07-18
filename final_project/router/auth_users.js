const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = username => {
    let usersWithSameUsername = users.filter(user => user.username === username);
    if (usersWithSameUsername.length > 0) {
        return true;
    }
    return false;
}

const authenticatedUser = (username, password) => {
    let validUser = users.filter(user => user.username === username && user.password === password);
    if (validUser.length > 0) {
        return true;
    }
    return false;
}

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        res.status(404).json({message: "Error logging in"});
    }

    if(authenticatedUser(username, password)) {
        const token = jwt.sign({
            data: password
        }, "access", { expiresIn: 60 * 60 });

        req.session.authorization = {
            token, username
        };

        return res.status(200).json({message: "User successfully logged in"});
    }
    else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const auth = req.body.auth;
    const review = req.body.review;
    const isbn = req.params.isbn;

    if(books[isbn]) {
        books[isbn].reviews = {
            ...books[isbn].reviews,
            [auth]: review
        };
    
        return res.status(200).json({message: "Review successfully added"});
    }
    return res.status(404).json({message: "Book not found"});
});

// Remove a book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user;

    if(!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    if(books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: "Review successfully deleted"});
    }

    return res.status(404).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
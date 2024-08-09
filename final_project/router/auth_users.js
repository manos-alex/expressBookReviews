const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let sameUsernames = users.filter(user => user.username === username);

  if (sameUsernames.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter(user => (user.username === username && user.password === password));

  if (validUsers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if (authenticatedUser(username, password)){
      let accessToken = jwt.sign({
        data: password
      }, 'access', {expiresIn: 60 * 60});

      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid login" });
    }
  } else {
    return res.status(404).json({ message: "You must provide both a username and password" })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book){
    let review = req.query.reviews;
    let user = req.session.authorization['username'];

    if (review) {
      book["reviews"][user] = review;
      books[isbn] = book;
    }
    res.send(`The review for the book with ISBN ${isbn} has been added`);
  } else {
    res.send(`The book with ISBN ${isbn} does not exist`);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let filteredBooks = books[isbn];
  if(filteredBooks) {
    let reviewer = req.session.authrization['username'];
    if(filteredBooks["reviews"][reviewer]) {
      delete filteredBooks["reviews"][reviewer];
      books[isbn] = filteredBooks;
    }
    res.send(`The review for the book with ISBN ${isbn} has been deleted`);
  }  else {
    res.send(`The book with ISBN ${isbn} does not exist`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

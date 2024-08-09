const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "Username already exists"})
    }
  } else {
    return res.status(404).json({message: "You must provide both a username and password"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 3)));
  });
    get_books.then(() =>  console.log("Promise get_books resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const get_book_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book) {
      resolve(res.send(book));
    } 

    reject(res.status(404).json({messgae:"ISBN not found"}));

    get_book_isbn.then(function() {
      console.log("Promise get_book_isbn resolved");
    }).catch(function() {
      console.log("Promise get_book_isbn rejected");
    });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const get_book_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn].author === author) {
        booksbyauthor.push({"isbn":isbn,
        "title":books[isbn]["title"],
        "reviews":books[isbn]["reviews"]});
        resolve(res.send(JSON.stringify({booksbyauthor}, null, 3)));
      }
    });
    reject(res.status(404).json({message:"Author not found"}));
  });
  get_book_author.then(function() {
    console.log("Promise get_book_author resolved");
  }
  ).catch(function() {
    console.log("Promise get_book_author rejected");
  }
  );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const get_book_title = new Promise((resolve, reject) => {
    for(i=1; i<=10; i++){
        let bookObj = books[i]
        if(bookObj.title == req.params.title){
            res.send(JSON.stringify({bookObj}, null, 3))
        }
    }
  })

  myPromise.then(() => {
    console.log("Promise get_book_title is resolved")
  }).catch(() => {
      console.log("Promise get_book_title rejected")
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
      
  let isbn = req.params.isbn
  let reqBook = books[isbn]

  res.send(JSON.stringify(reqBook.reviews))

});


module.exports.general = public_users;

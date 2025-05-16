const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  const user= users.find(elem=> elem.username===username);
  return !user
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password}=req.body
  if(username && password && authenticatedUser(username,password)){
    const token =jwt.sign({username}, "irfanaly", {expiresIn:"1h"})
    req.session.authorization={
      accessToken:token
    }
    req.user={username}
    return res.status(200).json({message:"User logged in successfully"})
  }else{
    return res.status(404).json({message:"Invalid credentials"})
  }
  // return res.status(300).json({message: ""});
});

// Add a book review




regd_users.post("/auth/review/:isbn", (req, res) => {
 const {
  params:{isbn},
  body
 } = req
 const username=req.user.username
 const review= body.review;
 if(!review){
  return res.status(400).json({message: "Book REview is not provided"});
 }
 console.log(username)
  if(!isNaN(isbn) && review){
    books[isbn]
    
    books[isbn].reviews[username]=review

    return res.status(201).json({message:"Review Addded successfully"})
  }
  return res.status(400).json({message: "Invalid Book ISBN"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
const {
  params:{isbn},
  body
 } = req
 const username=req.user.username
 const review= body.review;
  if(!review){
  return res.status(400).json({message: "Book REview is not provided"});
 }
  if(!isNaN(isbn) && review){
    books[isbn]
    if(books[isbn].reviews[username]){
    books[isbn].reviews[username]=review
    return res.status(201).json({message:"Review Addded successfully"})
     }
     else{
      return res.status(404).json({message:"You have no reviews yet to update"})
     }
  }
  return res.status(400).json({message: "Invalid book ISBN or missing Review"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
 const {
  params:{isbn},
  body
 } = req
 const username=req.user.username
  if(!isNaN(isbn)){
   if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "You have not added a review for this book" });
    } }
  return res.status(404).json({ message: "Invalid Book ISBN"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


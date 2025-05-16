const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password){
    return res.json({message:"Username and Password are requried for registration"})
  }
  if(!isValid(username)){
    return res.status(400).json({message:`User with ${username} username already exist`})
  }
  users.push({username, password});
  return res.status(201).json({message: "User account created successfuly"});
});

// Get the book list available in the shop
const getBooks= async()=>{
 return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 2000); // Simulate delay
  });
}
public_users.get('/', async(req, res)=> {
  try {
    const books = await getBooks()
    return res.status(200).json({books});
    
  } catch (error) {
    return res.status(500).json({message:error})
    
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn=req.params.isbn;

  new Promise((resolve,reject)=>{
    const book= books[isbn]
    if(book) resolve(book)
    else reject("Book not found")
  }).then(book=>res.json(book))
  .catch(err=>res.status(404).json({message:err}))


  // return res.status(404).json({message: "Book not Found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author= req.params.author;
  const book=[]
  for(let key in books){
    if(books[key].author.toLowerCase().includes(author.toLowerCase())){
      book.push(books[key]);
      
    }
  }
  if(book.length==0){
        return res.status(404).send(`There are no books with author ${author }`)

  }
  console.log(book)
  return res.json(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   const title= req.params.title;
  const book=[]
  for(let key in books){
    if(books[key].title.toLowerCase().includes(title.toLowerCase())){
      book.push(books[key]);
      
    }
  }
  if(book.length==0){
    return res.status(404).send(`There are no books with title ${title }`)
  }
  console.log(book)
  return res.json(book);});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn=req.params.isbn
  try {
    const review= books[isbn].reviews
    res.json(review)
    
  } catch (error) {

    res.status(400).json({message:"Error occured while finding review",error})
    
  }
  // if(Object.keys(review).length === 0){
  //   return res.status(404).json({message:"There are no reviews for this book"})
  // }
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid"); 
const multer = require("multer");

app.use(methodOverride("_method"));  // allow all the method (put,delete)
app.use(express.urlencoded({ extended: true }));  // parse the data
app.set("view engine", "ejs");  // set view engine 
app.set("views", path.join(__dirname, "views")); // sets the path of views
app.use(express.static(path.join(__dirname, "public"))); // serve all files under the public

// Serve static files from the uploads directory
//app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// multer configration
const storage = multer.diskStorage({
  destination: "./public/uploads/",   // location where the files will be stored 
  filename: (req, file, cb) => {
    cb(null,  Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

let posts = [
  {
    id: uuidv4(),
    username: "sagar",
    content: "hello FB",
  },
  {
    id: uuidv4(),
    username: "swastik",
    content: "hello instagram",
  },
  {
    id: uuidv4(),
    username: "sir",
    content: "hello baccho",
  },
];

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts", upload.single('image'), (req, res) => {
  let { username, content } = req.body;
  let image = req.file ? req.file.filename : null;
  let id = uuidv4();
  posts.push({ id, username, content, image });
  res.redirect("/posts");
});

// see detailed post
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("show.ejs", { post });
});


// edit the post
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  // console.log(req.params);
  // console.log(req.body);
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id);
  post.content = newContent;
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts");
});

app.listen(port, () => {
  console.log(`server listening on site http://localhost:${port}/posts`);
});
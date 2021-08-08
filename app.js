const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { response } = require("express");
require('dotenv').config()
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a3ov0.mongodb.net/wikiDB?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.route("/articles")

.get((req,res) => {
    Article.find({}, (err, foundArticles) => {
        if(err){
            res.send(err)
        }
        else{
            res.send(foundArticles)
        }
    })
})

.post((req,res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save((err) => {
        if(err){
            res.send(err)
        }
        else{
            res.send("Article saved successfully")
        }
    })
})

.delete((req,res) => {
    Article.deleteMany({}, (err) => {
        if(err){
            res.send(err)
        }
        else{
            res.send("Deleted all articles successfully")
        }
    })
});

app.route("/article/:articleTitle")

.get((req,res) =>{
    Article.findOne({title:req.params.articleTitle}, (err, foundArticle) => {
        if(foundArticle)
            res.send(foundArticle)
        else{
            res.send("No article found with that title")
        }
    })
})

.put((req,res) => {
    console.log(req.params.articleTitle)
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err, result) => {
            if(err){
                res.send(err)
            }
            else if(result.modifiedCount > 0){
                res.send("Updated successfully")
            }
            else{
                res.send("Article not found")
            }
        }
    )
})

.patch((req,res) => {
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err, result) => {
            if(err){
                res.send(err)
            }
            else if(result.modifiedCount > 0){
                res.send("Successfully updated articles")
            }
            else{
                res.send("Article not found")
            }
        }
    )
})

.delete((req,res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err, result) => {
            if(err){
                res.send(err)
            }
            else if(result.deletedCount > 0){
                res.send("Successfully deleted articles")
            }
            else{
                res.send("Article not found")
            }
        }
    )
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});
  
const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")
    .get((req, res) => {
        Article.find().then((foundArticles) => {
            res.send(foundArticles);
        }).catch((err) => {
            console.log(err);
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save().then(() => {
            res.send("successfully added");
        }).catch((err) => {
            console.log(err);
        });
    })
    .delete((req, res) => {
        Article.deleteMany().then(() => {
            res.send("successfully deleted");
        }).catch((err) => {
            console.log(err);
        })
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }).then((foundArticle) => {
            res.send(foundArticle);
        }).catch((err) => {
            console.log(err);
        });
    })
    .put( (req, res) => {
         Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content }
        ).then(() => {
            res.send("Successfully updated the article.");
        }).catch((err) => {
            console.log(err);
        });
    })
    .patch( (req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            {$set:req.body}
        ).then(() => {
            res.send("Successfully updated the article.");
        }).catch((err) => {
            console.log(err);
        });
    })
    .delete((req,res) =>{
        Article.deleteOne(
            {title:req.params.articleTitle}
        ).then(() => {
            res.send("successfully deleted");
        }).catch((err) => {console.log(err);})
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
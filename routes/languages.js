const express = require('express');

const Users = require('../db').Users;
const Posts = require('../db').Posts;
const myFunctions = require('../working_function/function');

const languages = express.Router();

languages.get('/', (req, res) => {
    Posts.all((err, posts) => {
        let newArray = [];
        if (posts.length > 0) {
            for (let i = 0; i < 3; i++) {
                newArray.push(posts[Math.floor(Math.random() * posts.length)]);
            }
        }
        res.render('main.ejs', { title: "Programming languages", posts: newArray });
    });
});

languages.get('/:language', (req, res) => {
    const arrOfName = myFunctions.parseLanguages(req.params.language);
    Posts.findByLanguage(req.params.language, (err, posts) => {
        res.render(arrOfName[0], { title: arrOfName[1], posts: posts });
    });
});

module.exports = languages;
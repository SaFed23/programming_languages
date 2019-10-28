const express = require('express');

const Posts = require('../db').Posts;
const myFunctions = require('../working_function/function');

const posts = express.Router();

posts.get('/new/:language', (req, res) => {
    res.render('new_post.ejs', { title: "New Post", language: req.params.language });
});

posts.post('/new', (req, res) => {
    const post = {
        language: req.body.language,
        date: (new Date).toString(),
        title: req.body.title,
        context: req.body.context
    };
    Posts.create(post, (err) => {});
    res.redirect('/languages/' + req.body.language);
});

posts.get('/:id', (req, res) => {
    Posts.findById(req.params.id, (err, post) => {
        res.render('post.ejs', { title: post.title, post: post });
    });
});

posts.get('/delete/:id', (req, res) => {
    Posts.delete(req.params.id, (err) => {});
    res.redirect('/languages');
});

posts.get('/update/:id', (req, res) => {
    Posts.findById(req.params.id, (err, post) => {
        res.render('update_post.ejs', { title: "Update post", post: post });
    });
});

posts.post('/update/:id', (req, res) => {
    Posts.update(req.params.id, req.body, (err) => {});
    res.redirect('/posts/' + req.params.id);
});

module.exports = posts;
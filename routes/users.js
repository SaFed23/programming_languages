const express = require('express');

const Users = require('../db').Users;
const Posts = require('../db').Posts;

const users = express.Router();

users.get('/register', (req, res) => {
    res.render('register.ejs', { title: "Sing up", message: [] })
});

users.post('/register', (req, res) => {
    let newUser = req.body.user;
    Users.find(newUser.login, (err, result) => {
        if (result) {
            res.render('register.ejs', { title: "Sing up", message: 'This login is occupied' })
        } else if (newUser.password === newUser.repeatPassword) {
            Users.create(newUser, (err) => {});
            req.session.login = newUser.login;
            res.redirect('/languages');
        } else {
            res.render('register.ejs', { title: "Sing up", message: 'Your passwords are not equal' });
        }
    });
});

users.post('/login', (req, res) => {
    Users.authenticate(req.body, (err, user) => {
        if (err) {
            res.locals.loginMessage = err;
            res.render('main.ejs', { title: "Programming languages" });
        } else {
            req.session.login = user.login;
            res.redirect("/languages");
        }
    });
});

users.get('/logout', (req, res) => {
    req.session.destroy((err) => {});
    res.redirect("/languages");
});

users.get('/profile', (req, res) => {
    Users.find(req.session.login, (err, user) => {
        Posts.all((err, posts) => {
            let subscribes = {};
            const languages = user.favourite_languages.split(";");
            posts.forEach(post => {
                if (languages.indexOf(post.lang_name) !== -1 && (new Date(user.last_date)) <= (new Date(post.date))) {
                    if (Object.keys(subscribes).indexOf(post.lang_name) === -1) {
                        subscribes[post.lang_name] = [post];
                    } else {
                        subscribes[post.lang_name].push(post);
                    }
                }
            });
            res.render('profile.ejs', { title: "profile", user: user, subscribes: subscribes });
        });
    });
});

users.post('/profile', (req, res) => {
    Users.update(req.session.login, req.body);
    Users.all((err, users) => {});
    req.session.login = req.body.login;
    res.redirect('/languages');
});

users.get('/all', (req, res) => {
    Users.all((err, users) => {
        res.render('all_users.ejs', { title: 'all_users', users: users })
    });
});

users.get('/subscribe/:language', (req, res) => {
    Users.addFavouriteLanguage(req.params.language, req.session.login, (err) => {});
    res.redirect('back');
});

users.get('/readall', (req, res) => {
    Users.updateLastDate(req.session.login, (err) => {});
    res.redirect('back');
});

users.get('/delete/:id', (req, res) => {
    Users.delete(req.params.id, (err) => {});
    res.redirect('back');
});

module.exports = users;
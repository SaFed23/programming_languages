const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const languages = require('./routes/languages');
const users = require('./routes/users');
const posts = require('./routes/posts');
const { currentUser } = require('./middlewares/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.locals.loginMessage = "";
    next();
});

app.use(currentUser);

app.use('/languages', languages);
app.use('/users', users);
app.use('/posts', posts);


app.listen(3001, () => {
    console.log("Server is running on localhost:3001");
});
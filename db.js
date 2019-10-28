const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id integer primary key, login TEXT, password TEXT, email TEXT, favourite_languages TEXT DEFAULT '', last_date TEXT)");
    db.run('CREATE TABLE IF NOT EXISTS posts (id integer primary key, lang_name TEXT, date TEXT, title TEXT, context TEXT)');
});

class Users {
    static all(cb) {
        db.all('SELECT * FROM users', cb);
    }

    static find(login, cb) {
        db.get('SELECT * FROM users WHERE login = ?', login, cb);
    }

    static create(data, cb) {
        const sql = 'INSERT INTO users(login, password, email, last_date) VALUES (?, ?, ?, ?)';
        db.run(sql, data.login, data.password, data.email, (new Date).toString(), cb);
    }

    static delete(id, cb) {
        db.run('DELETE FROM users WHERE id = ?', id, cb);
    }

    static authenticate(data, cb) {
        Users.find(data.login, (err, user) => {
            if (user) {
                if (data.password === user.password) {
                    cb(null, user);
                } else {
                    cb("Error in password");
                }
            } else {
                cb("User doesn't exist");
            }
        });
    }

    static update(login, data, cb) {
        db.run('UPDATE users SET login=?, email=? WHERE login=?', data.login, data.email, login, cb);
    }

    static addFavouriteLanguage(language, login, cb) {
        Users.find(login, (err, user) => {
            if (user.favourite_languages !== "") {
                let favouriteLanguages = user.favourite_languages.split(";");
                if (favouriteLanguages.indexOf(language) === -1) {
                    favouriteLanguages.push(language);
                    db.run('UPDATE users SET favourite_languages = ? WHERE login = ?', favouriteLanguages.join(";"), login, cb);
                }
            } else {
                db.run('UPDATE users SET favourite_languages = ? WHERE login = ?', language, login, cb);
            }
        });
    }

    static updateLastDate(login, cb) {
        db.run('UPDATE users SET last_date = ? WHERE login = ?', (new Date).toString(), login, cb);
    }
}

class Posts {
    static all(cb) {
        db.all('SELECT * FROM posts', cb);
    }

    static findByLanguage(language, cb) {
        db.all('SELECT * FROM posts WHERE lang_name = ?', language, cb);
    }

    static findById(id, cb) {
        db.get('SELECT * FROM posts WHERE id = ?', id, cb);
    }

    static create(post, cb) {
        const sql = 'INSERT INTO posts(lang_name, date, title, context) VALUES (?, ?, ?, ?)';
        db.run(sql, post.language, post.date, post.title, post.context, cb);
    }

    static delete(id, cb) {
        db.run('DELETE FROM posts WHERE id = ?', id, cb);
    }

    static update(id, data, cb) {
        db.run('UPDATE posts SET date=?, title=?, context=? WHERE id=?', (new Date()).toString(), data.title, data.context, id, cb);
    }
}

module.exports.Users = Users;
module.exports.Posts = Posts;
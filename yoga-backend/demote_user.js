const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./yoga_db.sqlite');
db.run("UPDATE users SET role = 'user' WHERE email = 'samradhmalli7@gmail.com'", (err) => {
    if (err) console.error(err);
    else console.log('Updated samradhmalli7@gmail.com to user role');
    db.close();
});

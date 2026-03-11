const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./yoga_db.sqlite');
db.all('SELECT email, role FROM users', (err, rows) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(rows, null, 2));
    db.close();
});

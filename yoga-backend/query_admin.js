const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./yoga_db.sqlite');

db.serialize(() => {
    db.all("SELECT id, name, email, role, password FROM users WHERE role = 'admin'", (err, rows) => {
        if (err) {
            console.error(err.message);
        } else if (rows.length === 0) {
            console.log('No admin users found.');
        } else {
            console.log('Admin Users:');
            console.log(JSON.stringify(rows, null, 2));
        }
    });
});
db.close();

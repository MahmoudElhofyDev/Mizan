console.log("Database file running");

const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database(
    "./mizan.db",
    (err)=>{

        if(err){

            console.log("Database Error:",err);

        }
        else{

            console.log("Database Connected");

        }

    }
);



db.serialize(()=>{



// =====================
// جدول المستخدمين
// =====================

db.run(`

CREATE TABLE IF NOT EXISTS users(

id INTEGER PRIMARY KEY AUTOINCREMENT,

username TEXT UNIQUE,

password TEXT

)

`);




// =====================
// جدول ملفات الحفظ
// =====================

db.run(`

CREATE TABLE IF NOT EXISTS cases(

id INTEGER PRIMARY KEY AUTOINCREMENT,

fileNumber TEXT,

clientName TEXT,

opponent TEXT,

court TEXT,

type TEXT,

birthDate TEXT,

documentation TEXT

)

`);





// =====================
// جدول التوكيلات
// =====================

db.run(`

CREATE TABLE IF NOT EXISTS powers(

id INTEGER PRIMARY KEY AUTOINCREMENT,

fileNumber TEXT,

powerNumber TEXT,

clientName TEXT,

type TEXT,

birthDate TEXT,

documentation TEXT

)

`);




});




module.exports = db;


console.log("Database setup finished");
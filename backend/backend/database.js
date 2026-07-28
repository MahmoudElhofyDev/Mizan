// =====================================
// MIZAN DATABASE
// PostgreSQL
// =====================================


console.log(
    "PostgreSQL Database running"
);



const { Pool } = require("pg");



const pool = new Pool({

    connectionString:
    process.env.DATABASE_URL,


    ssl:{

        rejectUnauthorized:false

    }

});




// =====================================
// اختبار الاتصال
// =====================================

pool.connect()

.then(client=>{


    console.log(
        "PostgreSQL Connected"
    );


    client.release();


})


.catch(err=>{


    console.log(
        "Database Connection Error:",
        err.message
    );


});






// =====================================
// إنشاء الجداول
// =====================================

async function setupDatabase(){


try{



// ===========================
// Users
// ===========================


await pool.query(`

CREATE TABLE IF NOT EXISTS users

(

id SERIAL PRIMARY KEY,

username TEXT UNIQUE NOT NULL,

password TEXT NOT NULL

)

`);








// ===========================
// Cases
// ===========================


await pool.query(`

CREATE TABLE IF NOT EXISTS cases

(

id SERIAL PRIMARY KEY,


file_number TEXT UNIQUE NOT NULL,


client_name TEXT NOT NULL,


opponent TEXT DEFAULT '',


court TEXT DEFAULT '',


type TEXT DEFAULT '',


birth_date TEXT DEFAULT '',


documentation TEXT DEFAULT ''


)

`);








// ===========================
// Powers
// ===========================


await pool.query(`

CREATE TABLE IF NOT EXISTS powers

(

id SERIAL PRIMARY KEY,


file_number TEXT DEFAULT '',


power_number TEXT UNIQUE NOT NULL,


client_name TEXT NOT NULL,


type TEXT DEFAULT '',


birth_date TEXT DEFAULT '',


documentation TEXT DEFAULT ''


)

`);







// ===========================
// تأكيد القيود
// ===========================


await pool.query(`

DO $$

BEGIN


IF NOT EXISTS (

SELECT 1

FROM pg_constraint

WHERE conname =
'cases_file_number_unique'

)

THEN


ALTER TABLE cases

ADD CONSTRAINT cases_file_number_unique

UNIQUE(file_number);


END IF;


END $$;

`);






console.log(

    "Tables Ready"

);



}


catch(error){


console.log(

    "Database Setup Error:",

    error.message

);


}



}







setupDatabase();






module.exports = pool;
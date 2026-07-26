console.log("PostgreSQL Database running");


const { Pool } = require("pg");


const pool = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl:{
        rejectUnauthorized:false
    }

});



pool.connect()

.then(client=>{

    console.log("PostgreSQL Connected");

    client.release();

})

.catch(err=>{

    console.log("Database Error:",err);

});





async function setupDatabase(){

try{


await pool.query(`

CREATE TABLE IF NOT EXISTS users(

id SERIAL PRIMARY KEY,

username TEXT UNIQUE,

password TEXT

)

`);





await pool.query(`

CREATE TABLE IF NOT EXISTS cases(

id SERIAL PRIMARY KEY,

file_number TEXT,

client_name TEXT,

opponent TEXT,

court TEXT,

type TEXT,

birth_date TEXT,

documentation TEXT

)

`);





await pool.query(`

CREATE TABLE IF NOT EXISTS powers(

id SERIAL PRIMARY KEY,

file_number TEXT,

power_number TEXT,

client_name TEXT,

type TEXT,

birth_date TEXT,

documentation TEXT

)

`);




console.log("Tables ready");


}

catch(error){

console.log(error);

}


}



setupDatabase();



module.exports = pool;
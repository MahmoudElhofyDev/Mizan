const sqlite3 = require("sqlite3").verbose();
const { Pool } = require("pg");


// PostgreSQL Railway

const pool = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl:{
        rejectUnauthorized:false
    }

});



// SQLite القديم

const sqlite = new sqlite3.Database("./mizan.db");





async function migrate(){


console.log("START MIGRATION");



try{


// =====================
// نقل القضايا
// =====================


sqlite.all(

"SELECT * FROM cases",

async(err,cases)=>{


if(err){

console.log(err);
return;

}



console.log(
"Cases:",
cases.length
);



for(let c of cases){


await pool.query(

`

INSERT INTO cases

(
file_number,
client_name,
opponent,
court,
type,
birth_date,
documentation
)

VALUES
($1,$2,$3,$4,$5,$6,$7)

`,

[

c.fileNumber,
c.clientName,
c.opponent,
c.court,
c.type,
c.birthDate,
c.documentation

]


);


}



console.log("Cases Done");





// =====================
// نقل التوكيلات
// =====================


sqlite.all(

"SELECT * FROM powers",

async(err,powers)=>{


console.log(
"Powers:",
powers.length
);



for(let p of powers){


await pool.query(

`

INSERT INTO powers

(
file_number,
power_number,
client_name,
type,
birth_date,
documentation
)

VALUES
($1,$2,$3,$4,$5,$6)

`,

[

p.fileNumber,
p.powerNumber,
p.clientName,
p.type,
p.birthDate,
p.documentation

]

);



}



console.log("Powers Done");


console.log("MIGRATION FINISHED");


process.exit();


}

);



}

);



}


catch(error){

console.log(error);

process.exit();

}


}



migrate();
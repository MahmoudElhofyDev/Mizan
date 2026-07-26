const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");


const app = express();


app.use(cors());

app.use(express.json());


const SECRET = "MIZAN_SECRET_KEY";




// =====================
// اختبار السيرفر
// =====================

app.get("/",(req,res)=>{

    res.send("Mizan Backend Running");

});






// =====================
// تسجيل مستخدم
// =====================

app.post("/register", async(req,res)=>{


try{


const {
username,
password
}=req.body;



const hash =
await bcrypt.hash(password,10);



await db.query(

`
INSERT INTO users(username,password)

VALUES($1,$2)
`,

[
username,
hash
]

);



res.json({

message:"Account created"

});



}

catch(error){


res.status(400).json({

message:"User already exists"

});


}



});









// =====================
// تسجيل الدخول
// =====================

app.post("/login",async(req,res)=>{


try{


const {
username,
password
}=req.body;




let result =
await db.query(

"SELECT * FROM users WHERE username=$1",

[
username
]

);



if(result.rows.length===0){


return res.status(401).json({

message:"Wrong username or password"

});


}




let user =
result.rows[0];





let match =
await bcrypt.compare(

password,

user.password

);





if(!match){


return res.status(401).json({

message:"Wrong username or password"

});


}




let token =
jwt.sign(

{

id:user.id,

username:user.username

},

SECRET,

{

expiresIn:"1d"

}

);





res.json({

message:"Login success",

token,

username:user.username

});



}

catch(error){


res.status(500).json({

message:"Server error"

});


}



});









// =====================
// تغيير كلمة المرور
// =====================

app.put("/change-password",async(req,res)=>{


try{


const {

username,

oldPassword,

newPassword

}=req.body;





let result =
await db.query(

"SELECT * FROM users WHERE username=$1",

[
username
]

);





if(result.rows.length===0){


return res.status(404).json({

message:"المستخدم غير موجود"

});


}





let user=result.rows[0];





let match =
await bcrypt.compare(

oldPassword,

user.password

);





if(!match){


return res.status(401).json({

message:"كلمة المرور القديمة غير صحيحة"

});


}





let hash =
await bcrypt.hash(

newPassword,

10

);





await db.query(

`

UPDATE users

SET password=$1

WHERE username=$2

`,

[
hash,
username
]

);





res.json({

message:"تم تغيير كلمة المرور بنجاح"

});



}

catch(error){


res.status(500).json({

message:"حدث خطأ"

});


}



});









// =====================
// القضايا
// =====================


app.get("/cases",async(req,res)=>{


try{


let result =
await db.query(

"SELECT * FROM cases ORDER BY id DESC"

);



res.json(result.rows);



}

catch(error){


res.status(500).json({

message:"Database error"

});


}



});









app.post("/cases",async(req,res)=>{


try{


const data=req.body;



let result =
await db.query(

`

INSERT INTO cases

(
file_number,
client_name
)

VALUES($1,$2)

RETURNING id

`,

[

data.fileNumber,

data.clientName

]

);



res.json({

id:result.rows[0].id

});



}

catch(error){


res.status(500).json({

message:"Insert error"

});


}



});









app.put("/cases/:id",async(req,res)=>{


await db.query(

`

UPDATE cases

SET

file_number=$1,

client_name=$2

WHERE id=$3

`,

[

req.body.fileNumber,

req.body.clientName,

req.params.id

]

);



res.json({

message:"Updated"

});


});









app.delete("/cases/:id",async(req,res)=>{


await db.query(

"DELETE FROM cases WHERE id=$1",

[
req.params.id
]

);



res.json({

message:"Deleted"

});


});











// =====================
// التوكيلات
// =====================


app.get("/powers",async(req,res)=>{


let result =
await db.query(

"SELECT * FROM powers ORDER BY id DESC"

);



res.json(result.rows);



});









app.post("/powers",async(req,res)=>{


const data=req.body;



let result =
await db.query(

`

INSERT INTO powers

(

file_number,

power_number,

client_name,

documentation

)

VALUES($1,$2,$3,$4)

RETURNING id

`,

[

data.fileNumber,

data.powerNumber,

data.clientName,

data.documentation

]

);



res.json({

id:result.rows[0].id

});



});









app.put("/powers/:id",async(req,res)=>{


await db.query(

`

UPDATE powers

SET

file_number=$1,

power_number=$2,

client_name=$3,

documentation=$4

WHERE id=$5

`,

[

req.body.fileNumber,

req.body.powerNumber,

req.body.clientName,

req.body.documentation,

req.params.id

]

);



res.json({

message:"Updated"

});


});









app.delete("/powers/:id",async(req,res)=>{


await db.query(

"DELETE FROM powers WHERE id=$1",

[
req.params.id
]

);



res.json({

message:"Deleted"

});


});









// =====================
// فحص البيانات
// =====================

async function checkDatabase(){


try{


let cases =
await db.query(
"SELECT COUNT(*) FROM cases"
);


let powers =
await db.query(
"SELECT COUNT(*) FROM powers"
);



console.log(
"CASES COUNT:",
cases.rows[0].count
);



console.log(
"POWERS COUNT:",
powers.rows[0].count
);



}

catch(error){

console.log(error);

}



}









// =====================
// تشغيل السيرفر
// =====================


const PORT =
process.env.PORT || 3000;



app.listen(

PORT,

"0.0.0.0",

async()=>{


console.log(

`Mizan Server Running on port ${PORT}`

);



await checkDatabase();



}

);
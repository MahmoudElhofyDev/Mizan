const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");

setTimeout(()=>{

    db.all("SELECT * FROM cases", [], (err, rows)=>{

        console.log("CASES COUNT:", rows ? rows.length : err);

    });

},2000);


const app = express();


app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

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


    const {
        username,
        password
    } = req.body;



    const hash =
    await bcrypt.hash(password,10);



    db.run(

        `
        INSERT INTO users(username,password)
        VALUES(?,?)
        `,

        [
            username,
            hash
        ],

        function(err){


            if(err){

                return res.status(400).json({

                    message:"User already exists"

                });

            }



            res.json({

                message:"Account created"

            });


        }

    );


});









// =====================
// تسجيل الدخول
// =====================

app.post("/login",(req,res)=>{


    const {
        username,
        password
    } = req.body;



    db.get(

        "SELECT * FROM users WHERE username=?",

        [
            username
        ],


        async(err,user)=>{


            if(!user){

                return res.status(401).json({

                    message:"Wrong username or password"

                });

            }



            const match =
            await bcrypt.compare(
                password,
                user.password
            );



            if(!match){

                return res.status(401).json({

                    message:"Wrong username or password"

                });

            }





            const token =
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

                token

            });



        }


    );


});











// =====================
// تغيير كلمة المرور
// =====================

app.put("/change-password", async(req,res)=>{


    const {

        username,

        oldPassword,

        newPassword

    } = req.body;




    db.get(

        "SELECT * FROM users WHERE username=?",

        [
            username
        ],


        async(err,user)=>{


            if(!user){

                return res.status(404).json({

                    message:"المستخدم غير موجود"

                });

            }




            const match =
            await bcrypt.compare(

                oldPassword,

                user.password

            );





            if(!match){

                return res.status(401).json({

                    message:"كلمة المرور القديمة غير صحيحة"

                });

            }






            const hash =
            await bcrypt.hash(

                newPassword,

                10

            );






            db.run(

                "UPDATE users SET password=? WHERE username=?",

                [

                    hash,

                    username

                ],


                function(err){


                    if(err){

                        return res.status(500).json({

                            message:"حدث خطأ"

                        });

                    }



                    res.json({

                        message:"تم تغيير كلمة المرور بنجاح"

                    });


                }


            );



        }


    );



});











// =====================
// القضايا
// =====================



app.get("/cases",(req,res)=>{


    db.all(

        "SELECT * FROM cases",

        [],

        (err,rows)=>{


            res.json(rows);


        }


    );


});







app.post("/cases",(req,res)=>{


    const data=req.body;



    db.run(

`
INSERT INTO cases(

fileNumber,

clientName

)

VALUES(?,?)

`,

[

data.fileNumber,

data.clientName

],


function(err){


    res.json({

        id:this.lastID

    });



}



);


});







app.put("/cases/:id",(req,res)=>{


    db.run(

`
UPDATE cases

SET

fileNumber=?,

clientName=?

WHERE id=?

`,

[

req.body.fileNumber,

req.body.clientName,

req.params.id

],


function(err){


    res.json({

        message:"Updated"

    });


}


);


});









app.delete("/cases/:id",(req,res)=>{


    db.run(

        "DELETE FROM cases WHERE id=?",

        [

            req.params.id

        ],


        function(err){


            res.json({

                message:"Deleted"

            });


        }


    );


});











// =====================
// التوكيلات
// =====================



app.get("/powers",(req,res)=>{


    db.all(

        "SELECT * FROM powers",

        [],

        (err,rows)=>{


            res.json(rows);


        }


    );


});









app.post("/powers",(req,res)=>{


    const data=req.body;



    db.run(

`
INSERT INTO powers(

fileNumber,

powerNumber,

clientName,

documentation

)

VALUES(?,?,?,?)

`,

[

data.fileNumber,

data.powerNumber,

data.clientName,

data.documentation

],



function(err){


    res.json({

        id:this.lastID

    });


}



);



});









app.put("/powers/:id",(req,res)=>{


    db.run(

`
UPDATE powers

SET

fileNumber=?,

powerNumber=?,

clientName=?,

documentation=?

WHERE id=?

`,

[

req.body.fileNumber,

req.body.powerNumber,

req.body.clientName,

req.body.documentation,

req.params.id

],


function(err){


    res.json({

        message:"Updated"

    });



}



);


});









app.delete("/powers/:id",(req,res)=>{


    db.run(

        "DELETE FROM powers WHERE id=?",

        [

            req.params.id

        ],


        function(err){


            res.json({

                message:"Deleted"

            });


        }


    );


});











// =====================
// تشغيل السيرفر
// =====================

const PORT = process.env.PORT || 3000;

app.listen(

    PORT,

    "0.0.0.0",

    ()=>{

        console.log(

            `Mizan Server Running on port ${PORT}`

        );

    }

);
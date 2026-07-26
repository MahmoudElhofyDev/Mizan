const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");


const app = express();


app.use(cors());

app.use(express.json({
    limit:"20mb"
}));



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



    try{


        const hash =
        await bcrypt.hash(
            password,
            10
        );



        await db.query(

        `
        INSERT INTO users
        (
            username,
            password
        )

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


        console.log(error);


        res.status(400).json({

            message:"User already exists"

        });


    }


});









// =====================
// تسجيل الدخول
// =====================

app.post("/login", async(req,res)=>{


    const {

        username,

        password

    } = req.body;




    try{


        let result =

        await db.query(

        `
        SELECT *
        FROM users
        WHERE username=$1
        `,

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


        console.log(error);


        res.status(500).json({

            message:"Server error"

        });


    }



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




    try{


        let result =

        await db.query(

        `
        SELECT *
        FROM users
        WHERE username=$1
        `,

        [

            username

        ]

        );





        if(result.rows.length===0){


            return res.status(404).json({

                message:"المستخدم غير موجود"

            });


        }





        let user =
        result.rows[0];





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


        console.log(error);


        res.status(500).json({

            message:"حدث خطأ"

        });


    }



});

// =====================
// القضايا
// =====================


// جلب القضايا

app.get("/cases", async(req,res)=>{


    try{


        let result =

        await db.query(

        `
        SELECT *
        FROM cases
        ORDER BY id DESC

        `

        );


        res.json(result.rows);



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Error loading cases"

        });


    }



});








// إضافة قضية

app.post("/cases", async(req,res)=>{


    const data=req.body;



    try{


        let result =

        await db.query(

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


        RETURNING id

        `,


        [


            data.fileNumber || "",

            data.clientName || "",

            data.opponent || "",

            data.court || "",

            data.type || "",

            data.birthDate || "",

            data.documentation || ""

        ]


        );





        res.json({

            id:
            result.rows[0].id

        });





    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Insert failed"

        });



    }



});









// تعديل قضية

app.put("/cases/:id", async(req,res)=>{


    const data=req.body;


    try{


        await db.query(

        `

        UPDATE cases

        SET

        file_number=$1,

        client_name=$2,

        opponent=$3,

        court=$4,

        type=$5,

        birth_date=$6,

        documentation=$7


        WHERE id=$8


        `,


        [


            data.fileNumber || "",

            data.clientName || "",

            data.opponent || "",

            data.court || "",

            data.type || "",

            data.birthDate || "",

            data.documentation || "",

            req.params.id


        ]

        );




        res.json({

            message:"Updated"

        });




    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Update failed"

        });



    }



});









// حذف قضية

app.delete("/cases/:id", async(req,res)=>{


    try{


        await db.query(

        `

        DELETE FROM cases

        WHERE id=$1

        `,

        [

            req.params.id

        ]

        );




        res.json({

            message:"Deleted"

        });




    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Delete failed"

        });


    }



});









// =====================
// استيراد القضايا Excel
// =====================


app.post("/cases/import", async(req,res)=>{


    try{


        const rows = req.body.data;



        for(let item of rows){



            await db.query(

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


                item.fileNumber || "",

                item.clientName || "",

                item.opponent || "",

                item.court || "",

                item.type || "",

                item.birthDate || "",

                item.documentation || ""


            ]

            );



        }





        res.json({

            message:"Cases imported successfully",

            count:rows.length

        });





    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Import failed"

        });


    }



});

// =====================
// التوكيلات
// =====================


// جلب التوكيلات

app.get("/powers", async(req,res)=>{


    try{


        let result =

        await db.query(

        `

        SELECT *

        FROM powers

        ORDER BY id DESC

        `

        );



        res.json(result.rows);



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Error loading powers"

        });


    }



});









// إضافة توكيل

app.post("/powers", async(req,res)=>{


    const data=req.body;



    try{


        let result =

        await db.query(

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


        RETURNING id


        `,


        [


            data.fileNumber || "",

            data.powerNumber || "",

            data.clientName || "",

            data.type || "",

            data.birthDate || "",

            data.documentation || ""


        ]

        );





        res.json({

            id:
            result.rows[0].id

        });





    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Insert failed"

        });



    }



});











// تعديل توكيل

app.put("/powers/:id", async(req,res)=>{


    const data=req.body;



    try{


        await db.query(

        `

        UPDATE powers

        SET

        file_number=$1,

        power_number=$2,

        client_name=$3,

        type=$4,

        birth_date=$5,

        documentation=$6


        WHERE id=$7


        `,


        [


            data.fileNumber || "",

            data.powerNumber || "",

            data.clientName || "",

            data.type || "",

            data.birthDate || "",

            data.documentation || "",

            req.params.id


        ]

        );





        res.json({

            message:"Updated"

        });





    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Update failed"

        });


    }



});











// حذف توكيل

app.delete("/powers/:id", async(req,res)=>{


    try{


        await db.query(

        `

        DELETE FROM powers

        WHERE id=$1

        `,


        [

            req.params.id

        ]

        );





        res.json({

            message:"Deleted"

        });




    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Delete failed"

        });



    }



});









// =====================
// استيراد التوكيلات Excel
// =====================


app.post("/powers/import", async(req,res)=>{


    try{


        const rows=req.body.data;



        for(let item of rows){



            await db.query(

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


                item.fileNumber || "",

                item.powerNumber || "",

                item.clientName || "",

                item.type || "",

                item.birthDate || "",

                item.documentation || ""


            ]

            );



        }





        res.json({

            message:"Powers imported successfully",

            count:rows.length

        });





    }

    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Import failed"

        });


    }



});











// =====================
// تشغيل السيرفر
// =====================


const PORT =
process.env.PORT || 3000;



app.listen(

PORT,

"0.0.0.0",

()=>{


console.log(
`Mizan Server Running on port ${PORT}`
);


});
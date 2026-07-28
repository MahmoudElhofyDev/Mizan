// =====================================
// MIZAN BACKEND
// PostgreSQL + Express
// =====================================


const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const db = require("./database");



const app = express();



app.use(cors());

app.use(express.json());



const SECRET = "MIZAN_SECRET_KEY";




// =====================================
// اختبار السيرفر
// =====================================


app.get("/", (req,res)=>{


    res.send(
        "Mizan Backend Running"
    );


});




// =====================================
// Register
// =====================================


app.post("/register", async(req,res)=>{


    try{


        const {

            username,

            password

        } = req.body;




        if(!username || !password){


            return res.status(400).json({

                success:false,

                message:"بيانات ناقصة"

            });


        }





        const hash = await bcrypt.hash(

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


            VALUES

            (

                $1,

                $2

            )

            `,

            [

                username,

                hash

            ]

        );





        res.json({

            success:true

        });




    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});







// =====================================
// Login
// =====================================


app.post("/login", async(req,res)=>{


    try{


        const {

            username,

            password

        } = req.body;






        const result = await db.query(

            `

            SELECT *

            FROM users

            WHERE username=$1

            `,

            [

                username

            ]

        );





        if(result.rows.length === 0){


            return res.status(401).json({

                success:false,

                message:"المستخدم غير موجود"

            });


        }





        const user = result.rows[0];






        const match = await bcrypt.compare(

            password,

            user.password

        );






        if(!match){


            return res.status(401).json({

                success:false,

                message:"كلمة المرور خطأ"

            });


        }






        const token = jwt.sign(

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

            success:true,

            token

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});

 
// =====================================
// CASES
// =====================================



// عرض الملفات

app.get("/cases", async(req,res)=>{


    try{


        const result = await db.query(

            `

            SELECT *

            FROM cases

            ORDER BY

            CASE

                WHEN file_number ~ '^[0-9]+$'

                THEN CAST(file_number AS INTEGER)

                ELSE 999999

            END ASC

            `

        );



        res.json(

            result.rows

        );



    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});









// آخر رقم ملف

app.get("/cases/last-file", async(req,res)=>{


    try{


        const result = await db.query(

            `

            SELECT file_number

            FROM cases

            WHERE file_number ~ '^[0-9]+$'

            ORDER BY

            CAST(file_number AS INTEGER)

            DESC

            LIMIT 1

            `

        );





        if(result.rows.length === 0){


            return res.json({

                lastPower:0

            });


        }





        res.json({

            lastFile:

            result.rows[0].file_number

        });



    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});











// إضافة ملف

app.post("/cases", async(req,res)=>{


    try{


        const {

            file_number,

            client_name,

            opponent,

            court,

            type,

            birth_date,

            documentation

        } = req.body;





        if(!file_number || !client_name){


            return res.status(400).json({

                success:false,

                message:"بيانات ناقصة"

            });


        }







        const check = await db.query(

            `

            SELECT id

            FROM cases

            WHERE file_number=$1

            `,

            [

                file_number

            ]

        );







        if(check.rows.length > 0){


            return res.json({

                success:false,

                message:"رقم الملف موجود بالفعل"

            });


        }









        const result = await db.query(

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

            (

                $1,

                $2,

                $3,

                $4,

                $5,

                $6,

                $7

            )


            RETURNING id

            `,

            [

                file_number,

                client_name,

                opponent || "",

                court || "",

                type || "",

                birth_date || "",

                documentation || ""

            ]

        );







        res.json({

            success:true,

            id:

            result.rows[0].id

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});











// تعديل ملف

app.put("/cases/:id", async(req,res)=>{


    try{


        const {

            file_number,

            client_name,

            opponent,

            court,

            type,

            birth_date,

            documentation

        } = req.body;








        const check = await db.query(

            `

            SELECT id

            FROM cases

            WHERE file_number=$1

            AND id<>$2

            `,

            [

                file_number,

                req.params.id

            ]

        );







        if(check.rows.length > 0){


            return res.json({

                success:false,

                message:"رقم الملف مستخدم بالفعل"

            });


        }








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

                file_number,

                client_name,

                opponent || "",

                court || "",

                type || "",

                birth_date || "",

                documentation || "",

                req.params.id

            ]

        );






        res.json({

            success:true

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});











// حذف ملف

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

            success:true

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});

 
// =====================================
// POWERS
// =====================================



// عرض التوكيلات

app.get("/powers", async(req,res)=>{


    try{


        const result = await db.query(

            `

            SELECT *

            FROM powers

            ORDER BY

            CASE

                WHEN power_number ~ '^[0-9]+$'

                THEN CAST(power_number AS INTEGER)

                ELSE 999999

            END ASC

            `

        );



        res.json(

            result.rows

        );



    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});











// آخر رقم توكيل

app.get("/powers/last-number", async(req,res)=>{


    try{


        const result = await db.query(

            `

            SELECT power_number

            FROM powers

            WHERE power_number ~ '^[0-9]+$'

            ORDER BY

            CAST(power_number AS INTEGER)

            DESC

            LIMIT 1

            `

        );





        if(result.rows.length === 0){


            return res.json({

                lastNumber:0

            });


        }






        res.json({

              lastPower:

    result.rows[0].power_number

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});











// إضافة توكيل

app.post("/powers", async(req,res)=>{


    try{


        const {


            file_number,

            power_number,

            client_name,

            type,

            birth_date,

            documentation



        } = req.body;








        if(

            !power_number ||

            !client_name

        ){


            return res.status(400).json({

                success:false,

                message:"بيانات ناقصة"

            });


        }








        const check = await db.query(

            `

            SELECT id

            FROM powers

            WHERE power_number=$1

            `,

            [

                power_number

            ]

        );







        if(check.rows.length > 0){


            return res.json({

                success:false,

                message:"رقم التوكيل موجود بالفعل"

            });


        }









        const result = await db.query(

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

            (

                $1,

                $2,

                $3,

                $4,

                $5,

                $6

            )


            RETURNING id

            `,

            [

                file_number || "",

                power_number,

                client_name,

                type || "",

                birth_date || "",

                documentation || ""

            ]

        );







        res.json({

            success:true,

            id:

            result.rows[0].id

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});












// تعديل توكيل

app.put("/powers/:id", async(req,res)=>{


    try{


        const {


            file_number,

            power_number,

            client_name,

            type,

            birth_date,

            documentation



        } = req.body;









        const check = await db.query(

            `

            SELECT id

            FROM powers

            WHERE power_number=$1

            AND id<>$2

            `,

            [

                power_number,

                req.params.id

            ]

        );








        if(check.rows.length > 0){


            return res.json({

                success:false,

                message:"رقم التوكيل مستخدم بالفعل"

            });


        }









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

                file_number || "",

                power_number,

                client_name,

                type || "",

                birth_date || "",

                documentation || "",

                req.params.id

            ]

        );








        res.json({

            success:true

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

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

            success:true

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});

// =====================================
// IMPORT EXCEL
// =====================================


// ===============================
// استيراد القضايا
// ===============================

app.post("/cases/import", async(req,res)=>{


    try{


        const {

            data

        } = req.body;




        if(!Array.isArray(data)){


            return res.status(400).json({

                success:false,

                message:"بيانات غير صحيحة"

            });


        }





        let added = 0;

        let duplicate = 0;

        let failed = 0;





        for(const item of data){


            try{



                if(

                    !item.file_number ||

                    !item.client_name

                ){

                    failed++;

                    continue;

                }





                const check = await db.query(

                    `

                    SELECT id

                    FROM cases

                    WHERE file_number=$1

                    `,

                    [

                        String(item.file_number)

                    ]

                );





                if(check.rows.length > 0){


                    duplicate++;

                    continue;


                }






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

                    (

                    $1,$2,$3,$4,$5,$6,$7

                    )

                    `,

                    [

                    String(item.file_number),

                    item.client_name,

                    item.opponent || "",

                    item.court || "",

                    item.type || "",

                    item.birth_date || "",

                    item.documentation || ""

                    ]

                );




                added++;



            }

            catch(error){


                failed++;


            }



        }





        res.json({

            success:true,

            added,

            duplicate,

            failed

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});









// ===============================
// استيراد التوكيلات
// ===============================


app.post("/powers/import", async(req,res)=>{


    try{


        const {

            data

        } = req.body;





        if(!Array.isArray(data)){


            return res.status(400).json({

                success:false,

                message:"بيانات غير صحيحة"

            });


        }






        let added = 0;

        let duplicate = 0;

        let failed = 0;






        for(const item of data){



            try{



                if(

                    !item.power_number ||

                    !item.client_name

                ){

                    failed++;

                    continue;

                }







                const check = await db.query(

                    `

                    SELECT id

                    FROM powers

                    WHERE power_number=$1

                    `,

                    [

                        String(item.power_number)

                    ]

                );







                if(check.rows.length > 0){


                    duplicate++;

                    continue;


                }








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

                    (

                    $1,$2,$3,$4,$5,$6

                    )

                    `,

                    [

                    item.file_number || "",

                    String(item.power_number),

                    item.client_name,

                    item.type || "",

                    item.birth_date || "",

                    item.documentation || ""

                    ]

                );





                added++;





            }

            catch(error){


                failed++;


            }



        }





        res.json({

            success:true,

            added,

            duplicate,

            failed

        });





    }

    catch(err){


        console.log(err);



        res.status(500).json({

            success:false,

            message:err.message

        });



    }


});









// =====================================
// تشغيل السيرفر
// =====================================

console.log("=== BEFORE LISTEN ===");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});

console.log("=== AFTER LISTEN ===");

app.listen(PORT,()=>{


    console.log(

        `Server Running On Port ${PORT}`

    );


});
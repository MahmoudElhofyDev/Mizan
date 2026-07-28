const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "MIZAN_SECRET_KEY";

// ===========================
// اختبار السيرفر
// ===========================

app.get("/", (req, res) => {

    res.send("Mizan Backend Running");

});

// ===========================
// تسجيل مستخدم
// ===========================

app.post("/register", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        const hash =
        await bcrypt.hash(password, 10);

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

            success: true,
            message: "Account created"

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,
            message: "User already exists"

        });

    }

});

// ===========================
// تسجيل الدخول
// ===========================

app.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        const result =
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

        if (result.rows.length == 0) {

            return res.status(401).json({

                success: false,
                message: "Wrong username or password"

            });

        }

        const user =
        result.rows[0];

        const match =
        await bcrypt.compare(

            password,
            user.password

        );

        if (!match) {

            return res.status(401).json({

                success: false,
                message: "Wrong username or password"

            });

        }

        const token =
        jwt.sign(

            {

                id: user.id,
                username: user.username

            },

            SECRET,

            {

                expiresIn: "1d"

            }

        );

        res.json({

            success: true,
            token

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});

// ===========================
// تغيير كلمة المرور
// ===========================

app.put("/change-password", async (req, res) => {

    try {

        const {

            username,

            oldPassword,

            newPassword

        } = req.body;

        const result =
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

        if (result.rows.length == 0) {

            return res.status(404).json({

                success: false,
                message: "User not found"

            });

        }

        const user =
        result.rows[0];

        const match =
        await bcrypt.compare(

            oldPassword,
            user.password

        );

        if (!match) {

            return res.status(401).json({

                success: false,
                message: "Old password incorrect"

            });

        }

        const hash =
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

            success: true,
            message: "Password Changed"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});

// =====================================
// القضايا
// =====================================

// عرض جميع القضايا

app.get("/cases", async (req, res) => {

    try {

        const result =
        await db.query(

            `
            SELECT *
            FROM cases
            ORDER BY CAST(file_number AS INTEGER) ASC
            `

        );

        res.json(result.rows);

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});


app.get("/cases", async (req, res) => {

    try {

        const result =
        await db.query(

            `
            SELECT *
            FROM cases
            ORDER BY CAST(file_number AS INTEGER) ASC
            `

        );

        res.json(result.rows);

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

});


// آخر رقم ملف

app.get("/cases/last-file", async (req, res) => {

    try {

        const result =
        await db.query(

            `
            SELECT file_number
            FROM cases
            ORDER BY CAST(file_number AS INTEGER) DESC
            LIMIT 1
            `

        );

        if (result.rows.length == 0) {

            return res.json({

                lastFile: 0

            });

        }

        res.json({

            lastFile:
            result.rows[0].file_number

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

});



// إضافة قضية

app.post("/cases", async (req, res) => {

    try {

        const {

            file_number,

            client_name

        } = req.body;

        const result =
        await db.query(

            `
            INSERT INTO cases
            (
                file_number,
                client_name
            )
            VALUES
            (
                $1,
                $2
            )
            RETURNING id
            `,

            [

                file_number,

                client_name

            ]

        );

        res.json({

            success: true,

            id:
            result.rows[0].id

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Insert Failed"

        });

    }

});



// تعديل قضية

app.put("/cases/:id", async (req, res) => {

    try {

        const {

            file_number,

            client_name

        } = req.body;

        await db.query(

            `
            UPDATE cases
            SET

            file_number=$1,

            client_name=$2

            WHERE id=$3
            `,

            [

                file_number,

                client_name,

                req.params.id

            ]

        );

        res.json({

            success: true,

            message: "Updated"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

});



// حذف قضية

app.delete("/cases/:id", async (req, res) => {

    try {

        await db.query(

            `
            DELETE
            FROM cases
            WHERE id=$1
            `,

            [

                req.params.id

            ]

        );

        res.json({

            success: true,

            message: "Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

});

// =====================================
// التوكيلات
// =====================================

// عرض جميع التوكيلات

app.get("/powers", async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT *
            FROM powers
            ORDER BY CAST(file_number AS INTEGER) ASC
            `
        );

        res.json(result.rows);

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

// إضافة توكيل

app.post("/powers", async (req, res) => {

    try {

        const {

            file_number,

            power_number,

            client_name,

            documentation

        } = req.body;

        const result = await db.query(

            `
            INSERT INTO powers
            (
                file_number,
                power_number,
                client_name,
                documentation
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING id
            `,

            [

                file_number,

                power_number,

                client_name,

                documentation

            ]

        );

        res.json({

            success: true,

            id: result.rows[0].id

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Insert Failed"

        });

    }

});

// تعديل توكيل

app.put("/powers/:id", async (req, res) => {

    try {

        const {

            file_number,

            power_number,

            client_name,

            documentation

        } = req.body;

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

                file_number,

                power_number,

                client_name,

                documentation,

                req.params.id

            ]

        );

        res.json({

            success: true,

            message: "Updated"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

});

// حذف توكيل

app.delete("/powers/:id", async (req, res) => {

    try {

        await db.query(

            `
            DELETE
            FROM powers
            WHERE id=$1
            `,

            [

                req.params.id

            ]

        );

        res.json({

            success: true,

            message: "Deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false

        });

    }

});

// =====================================
// تشغيل السيرفر
// =====================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});
const API = "https://mizan-production-32bb.up.railway.app";

// ==========================
// تسجيل الدخول
// ==========================

async function login() {

    let username = document.getElementById("username").value.trim();

    let password = document.getElementById("password").value.trim();

    let message = document.getElementById("message");

    message.innerHTML = "";

    if (username === "" || password === "") {

        message.innerHTML = "يرجى إدخال اسم المستخدم وكلمة المرور";

        return;

    }

    try {

        const response = await fetch(`${API}/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                username,

                password

            })

        });

        const data = await response.json();

        if (!response.ok) {

            message.innerHTML = data.message;

            return;

        }

        localStorage.setItem("loggedIn", "true");

        localStorage.setItem("username", username);

        localStorage.setItem("token", data.token);

        window.location.href = "dashboard.html";

    }

    catch (err) {

        console.error(err);

        message.innerHTML = "تعذر الاتصال بالسيرفر";

    }

}



// ==========================
// تسجيل خروج
// ==========================

function logout() {

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("username");

    localStorage.removeItem("token");

    window.location.href = "index.html";

}
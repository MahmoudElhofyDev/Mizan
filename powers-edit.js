// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// رقم التعديل
// =====================

let id =
localStorage.getItem("editPowerId");





// =====================
// تحميل بيانات التوكيل
// =====================

async function loadPowerEdit(){


    try{


        let response = await fetch(
            `${API}/powers`
        );


        let powers =
        await response.json();




        let currentPower =
        powers.find(
            item => item.id == id
        );





        if(currentPower){



            document.getElementById(
                "fileNumber"
            ).value =
            currentPower.fileNumber || "";




            document.getElementById(
                "powerNumber"
            ).value =
            currentPower.powerNumber || "";




            document.getElementById(
                "clientName"
            ).value =
            currentPower.clientName || "";




            document.getElementById(
                "documentation"
            ).value =
            currentPower.documentation || "";



        }




    }


    catch(error){


        alert(
            "تعذر تحميل البيانات"
        );


    }



}









// =====================
// حفظ التعديل
// =====================

async function savePowerEdit(){



    let data = {



        fileNumber:


        document.getElementById(
            "fileNumber"
        ).value,





        powerNumber:


        document.getElementById(
            "powerNumber"
        ).value,





        clientName:


        document.getElementById(
            "clientName"
        ).value,





        documentation:


        document.getElementById(
            "documentation"
        ).value



    };







    await fetch(

        `${API}/powers/${id}`,

        {

            method:"PUT",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:
            JSON.stringify(data)


        }


    );







    alert(
        "تم حفظ التعديل"
    );





    window.location.href =
    "powers.html";



}









// =====================
// رجوع
// =====================

function goBack(){


    window.location.href =
    "powers.html";


}









// تشغيل

loadPowerEdit();
// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// جلب رقم التعديل
// =====================

let id =
localStorage.getItem("editCaseId");




// =====================
// تحميل بيانات القضية
// =====================

async function loadCaseEdit(){


    try{


        let response = await fetch(
            `${API}/cases`
        );


        let cases =
        await response.json();



        let currentCase =
        cases.find(
            item => item.id == id
        );



        if(currentCase){


            document.getElementById(
                "fileNumber"
            ).value =
            currentCase.fileNumber || "";



            document.getElementById(
                "caseNumber"
            ).value =
            currentCase.caseNumber || "";



            document.getElementById(
                "clientName"
            ).value =
            currentCase.clientName || "";



            document.getElementById(
                "court"
            ).value =
            currentCase.court || "";



            document.getElementById(
                "caseType"
            ).value =
            currentCase.caseType || "";


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

async function saveCaseEdit(){



    let data = {


        fileNumber:

        document.getElementById(
            "fileNumber"
        ).value,



        caseNumber:

        document.getElementById(
            "caseNumber"
        ).value,



        clientName:

        document.getElementById(
            "clientName"
        ).value,



        court:

        document.getElementById(
            "court"
        ).value,



        caseType:

        document.getElementById(
            "caseType"
        ).value



    };







    await fetch(

        `${API}/cases/${id}`,

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
    "cases.html";



}









// =====================
// رجوع
// =====================

function goBack(){


    window.location.href =
    "cases.html";


}









// تشغيل

loadCaseEdit();
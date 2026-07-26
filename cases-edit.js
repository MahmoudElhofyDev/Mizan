const API =
"https://mizan-production-32bb.up.railway.app";



let editId =
localStorage.getItem("editCaseId");



let currentCase = null;





// =====================
// تحميل الملف
// =====================

async function loadCase(){


    try{


        let res =
        await fetch(`${API}/cases`);



        let cases =
        await res.json();



        currentCase =
        cases.find(
            c => c.id == editId
        );




        if(!currentCase){

            alert("الملف غير موجود");

            return;

        }




        document.getElementById("fileNumber").value =
        currentCase.fileNumber || "";



        document.getElementById("clientName").value =
        currentCase.clientName || "";



    }
    catch(err){

        console.log(err);

        alert("تعذر تحميل البيانات");

    }


}









// =====================
// حفظ التعديل
// =====================

async function saveCaseEdit(){



    let fileNumber =
    document.getElementById("fileNumber")
    .value.trim();



    let clientName =
    document.getElementById("clientName")
    .value.trim();





    if(
        fileNumber === "" ||
        clientName === ""
    ){

        alert("أدخل البيانات كاملة");

        return;

    }






    await fetch(

        `${API}/cases/${editId}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                fileNumber,

                clientName

            })

        }

    );






    alert("تم حفظ التعديل");



    window.location.href =
    "cases.html";



}









// تشغيل

loadCase();
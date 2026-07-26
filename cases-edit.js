// =====================
// رقم الملف المراد تعديله
// =====================

let id =

localStorage.getItem(
    "editCaseId"
);





let cases =

JSON.parse(

localStorage.getItem("cases")

) || [];







let currentCase =

cases.find(

item => item.id == id

);







// =====================
// تحميل البيانات
// =====================

if(currentCase){



    document.getElementById(
        "fileNumber"
    ).value =

    currentCase.fileNumber || "";




    document.getElementById(
        "clientName"
    ).value =

    currentCase.clientName || "";



}









// =====================
// حفظ التعديل
// =====================

function saveCaseEdit(){



    if(!currentCase){


        alert(
            "لم يتم العثور على الملف"
        );


        return;


    }






    let clientName =

    document.getElementById(
        "clientName"
    )

    .value

    .trim();






    if(clientName === ""){


        alert(
            "أدخل اسم الموكل"
        );


        return;


    }







    currentCase.clientName =

    clientName;







    localStorage.setItem(

        "cases",

        JSON.stringify(cases)

    );







    localStorage.removeItem(

        "editCaseId"

    );






    alert(

        "تم تعديل الملف بنجاح"

    );






    window.location.href =

    "cases.html";



}
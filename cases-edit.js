// =====================
// جلب رقم التعديل
// =====================

let id = localStorage.getItem("editCaseId");


let cases =
JSON.parse(
    localStorage.getItem("cases")
) || [];



let currentCase =
cases.find(
    c => c.id == id
);






// =====================
// تحميل بيانات الملف
// =====================

if(currentCase){


    document.getElementById("fileNumber").value =
    currentCase.fileNumber || "";



    document.getElementById("clientName").value =
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





    let fileNumber =
    document.getElementById("fileNumber")
    .value
    .trim();




    let clientName =
    document.getElementById("clientName")
    .value
    .trim();







    if(
        fileNumber === "" ||
        clientName === ""
    ){


        alert(
            "من فضلك املأ البيانات"
        );


        return;


    }







    currentCase.fileNumber =
    fileNumber;



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
        "تم حفظ تعديل الملف بنجاح"
    );






    window.location.href =
    "cases.html";



}
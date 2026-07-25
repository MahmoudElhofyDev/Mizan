// =====================
// جلب رقم التعديل
// =====================

let id = localStorage.getItem("editPowerId");



let powers =
JSON.parse(
    localStorage.getItem("powers")
) || [];





let currentPower =
powers.find(
    p => p.id == id
);









// =====================
// تحميل بيانات التوكيل
// =====================

if(currentPower){



    document.getElementById("fileNumber").value =
    currentPower.fileNumber || "";



    document.getElementById("powerNumber").value =
    currentPower.powerNumber || "";



    document.getElementById("clientName").value =
    currentPower.clientName || "";



    document.getElementById("documentation").value =
    currentPower.documentation || "";



}









// =====================
// حفظ التعديل
// =====================

function savePowerEdit(){



    if(!currentPower){


        alert(
            "لم يتم العثور على التوكيل"
        );


        return;

    }






    let fileNumber =
    document.getElementById("fileNumber")
    .value.trim();




    let powerNumber =
    document.getElementById("powerNumber")
    .value.trim();




    let clientName =
    document.getElementById("clientName")
    .value.trim();




    let documentation =
    document.getElementById("documentation")
    .value.trim();








    if(clientName === ""){


        alert(
            "أدخل اسم الموكل"
        );


        return;


    }







    currentPower.fileNumber =
    fileNumber;



    currentPower.powerNumber =
    powerNumber;



    currentPower.clientName =
    clientName;



    currentPower.documentation =
    documentation;







    localStorage.setItem(

        "powers",

        JSON.stringify(powers)

    );







    localStorage.removeItem(
        "editPowerId"
    );







    alert(
        "تم تعديل التوكيل بنجاح"
    );







    window.location.href =
    "powers.html";



}
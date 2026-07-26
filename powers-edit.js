// =====================
// تحميل البيانات
// =====================


let id =

localStorage.getItem(
    "editPowerId"
);





let powers =

JSON.parse(

localStorage.getItem("powers")

) || [];







let currentPower =

powers.find(

item => item.id == id

);







// =====================
// عرض البيانات
// =====================


if(currentPower){



    document.getElementById(
        "documentation"
    ).value =

    currentPower.documentation || "";





    document.getElementById(
        "clientName"
    ).value =

    currentPower.clientName || "";





    document.getElementById(
        "powerNumber"
    ).value =

    currentPower.powerNumber || "";





    document.getElementById(
        "fileNumber"
    ).value =

    currentPower.fileNumber || "";



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







    currentPower.documentation =

    document.getElementById(
        "documentation"
    )

    .value

    .trim();








    currentPower.clientName =

    document.getElementById(
        "clientName"
    )

    .value

    .trim();








    currentPower.powerNumber =

    document.getElementById(
        "powerNumber"
    )

    .value

    .trim();








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
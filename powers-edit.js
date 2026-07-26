const API =
"https://mizan-production-32bb.up.railway.app";



let editId =
localStorage.getItem("editPowerId");



let currentPower = null;







// =====================
// تحميل التوكيل
// =====================

async function loadPower(){


    try{


        let res =
        await fetch(`${API}/powers`);



        let powers =
        await res.json();




        currentPower =
        powers.find(
            p => p.id == editId
        );





        if(!currentPower){


            alert("التوكيل غير موجود");


            return;


        }






        document.getElementById("documentation").value =
        currentPower.documentation || "";



        document.getElementById("clientName").value =
        currentPower.clientName || "";



        document.getElementById("powerNumber").value =
        currentPower.powerNumber || "";



        document.getElementById("fileNumber").value =
        currentPower.fileNumber || "";





    }

    catch(err){


        console.log(err);


        alert("تعذر تحميل البيانات");


    }


}









// =====================
// حفظ التعديل
// =====================

async function savePowerEdit(){



    let documentation =
    document.getElementById("documentation")
    .value.trim();



    let clientName =
    document.getElementById("clientName")
    .value.trim();



    let powerNumber =
    document.getElementById("powerNumber")
    .value.trim();



    let fileNumber =
    document.getElementById("fileNumber")
    .value.trim();






    if(clientName===""){


        alert("أدخل اسم الموكل");


        return;


    }








    await fetch(

        `${API}/powers/${editId}`,

        {

            method:"PUT",

            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify({


                documentation,

                clientName,

                powerNumber,

                fileNumber


            })


        }


    );







    alert("تم حفظ التعديل");




    window.location.href =
    "powers.html";



}









// تشغيل

loadPower();
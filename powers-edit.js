// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";




// =====================
// رقم التوكيل
// =====================

let id =

localStorage.getItem("editPowerId");



let currentPower = null;







// =====================
// تحميل بيانات التوكيل
// =====================

async function loadPowerEdit(){


    try{


        let response = await fetch(

            `${API}/powers`

        );



        let powers = await response.json();




        currentPower = powers.find(

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
            "تعذر الاتصال بالسيرفر"
        );


    }



}









// =====================
// حفظ التعديل
// =====================

async function savePowerEdit(){



    if(!currentPower){


        alert(
            "التوكيل غير موجود"
        );


        return;


    }







    let powerNumber =

    document.getElementById(
        "powerNumber"
    )

    .value.trim();







    let clientName =

    document.getElementById(
        "clientName"
    )

    .value.trim();







    let documentation =

    document.getElementById(
        "documentation"
    )

    .value.trim();









    try{



        let response = await fetch(

            `${API}/powers/${id}`,

            {


                method:"PUT",


                headers:{


                    "Content-Type":
                    "application/json"


                },


                body:JSON.stringify({



                    fileNumber:
                    currentPower.fileNumber,



                    powerNumber:
                    powerNumber,



                    clientName:
                    clientName,



                    documentation:
                    documentation



                })



            }


        );







        await response.json();







        alert(

            "تم تعديل التوكيل بنجاح"

        );







        localStorage.removeItem(

            "editPowerId"

        );






        window.location.href =

        "powers.html";





    }


    catch(error){


        alert(

            "تعذر الاتصال بالسيرفر"

        );


    }



}









// تشغيل

loadPowerEdit();
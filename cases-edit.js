// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// جلب رقم القضية
// =====================

let id = localStorage.getItem("editCaseId");

let currentCase = null;





// =====================
// تحميل بيانات القضية
// =====================

async function loadCaseEdit(){


    try{


        let response = await fetch(
            `${API}/cases`
        );


        let cases = await response.json();



        currentCase = cases.find(
            item => item.id == id
        );




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

async function saveCaseEdit(){



    if(!currentCase){


        alert(
            "القضية غير موجودة"
        );


        return;


    }






    let fileNumber =

    document.getElementById(
        "fileNumber"
    )
    .value.trim();





    let clientName =

    document.getElementById(
        "clientName"
    )
    .value.trim();






    try{



        let response = await fetch(


            `${API}/cases/${id}`,

            {

                method:"PUT",


                headers:{


                    "Content-Type":
                    "application/json"


                },


                body:JSON.stringify({


                    fileNumber:fileNumber,


                    clientName:clientName



                })



            }


        );






        await response.json();






        alert(

            "تم تعديل القضية بنجاح"

        );





        localStorage.removeItem(
            "editCaseId"
        );





        window.location.href =
        "cases.html";





    }

    catch(error){


        alert(
            "تعذر الاتصال بالسيرفر"
        );


    }



}








// تشغيل

loadCaseEdit();
// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// متغيرات
// =====================

let powers = [];

let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let searchTimer;

let showingEmpty = false;









// =====================
// تحميل التوكيلات
// =====================

async function loadPowers(){


    try{


        let response = await fetch(

            `${API}/powers`

        );



        powers = await response.json();



        currentData=[];



        displayPowers();



    }


    catch(error){


        alert(

            "تعذر الاتصال بالسيرفر"

        );


    }


}









// =====================
// رقم الملف القادم
// =====================

function getNextFileNumber(){



    let last = 2432;



    powers.forEach(item=>{


        let num = Number(item.fileNumber);



        if(!isNaN(num) && num > last){


            last=num;


        }


    });



    return String(last+1);



}









// =====================
// إضافة توكيل
// =====================

async function addPower(){



    let fileNumber =

    document.getElementById(
        "fileNumber"
    ).value.trim();





    let powerNumber =

    document.getElementById(
        "powerNumber"
    ).value.trim();





    let clientName =

    document.getElementById(
        "clientName"
    ).value.trim();





    let documentation =

    document.getElementById(
        "documentation"
    ).value.trim();







    if(fileNumber===""){


        fileNumber=getNextFileNumber();


    }






    if(clientName===""){


        alert(
            "أدخل اسم الموكل"
        );


        return;


    }






    try{


        await fetch(

            `${API}/powers`,

            {

                method:"POST",


                headers:{


                    "Content-Type":
                    "application/json"


                },


                body:JSON.stringify({


                    fileNumber:fileNumber,


                    powerNumber:powerNumber,


                    clientName:clientName,


                    documentation:documentation



                })


            }


        );







        alert(
            "تم إضافة التوكيل"
        );




        clearInputs();



        loadPowers();



    }


    catch(error){


        alert(
            "تعذر الاتصال بالسيرفر"
        );


    }



}









// =====================
// عرض البيانات
// =====================

function displayPowers(){



    let table =

    document.getElementById(
        "powersTable"
    );



    if(!table)

    return;





    table.innerHTML="";






    let data =

    currentData.length

    ?

    currentData

    :

    powers;







    let start =

    (currentPage-1)

    *

    rowsPerPage;







    data.slice(

        start,

        start+rowsPerPage

    )

    .forEach(power=>{





        table.innerHTML += `


<tr>


<td>

${power.fileNumber || ""}

</td>



<td>

${power.powerNumber || ""}

</td>



<td>

${power.clientName || ""}

</td>



<td>

${power.documentation || ""}

</td>



<td>


<button class="edit"

onclick="editPower(${power.id})">

تعديل

</button>


</td>



<td>


<button class="delete"

onclick="deletePower(${power.id})">

حذف

</button>


</td>



</tr>


`;



    });





    createPagination();



}









// =====================
// البحث
// =====================

function searchPowers(){



    let value =

    document.getElementById(
        "search"
    )

    .value

    .toLowerCase()

    .trim();







    if(value===""){


        currentData=[];


    }

    else{


        currentData = powers.filter(item=>{


            return (


                String(item.fileNumber)

                .includes(value)



                ||

                String(item.powerNumber)

                .toLowerCase()

                .includes(value)



                ||

                String(item.clientName)

                .toLowerCase()

                .includes(value)



                ||

                String(item.documentation)

                .toLowerCase()

                .includes(value)



            );



        });



    }





    currentPage=1;


    displayPowers();



}







function delaySearch(){


    clearTimeout(searchTimer);



    searchTimer=setTimeout(()=>{


        searchPowers();


    },500);



}









// =====================
// حذف
// =====================

async function deletePower(id){



    if(!confirm(
        "هل تريد حذف التوكيل؟"
    ))

    return;






    await fetch(

        `${API}/powers/${id}`,

        {

            method:"DELETE"

        }

    );





    loadPowers();



}









// =====================
// تعديل
// =====================

function editPower(id){



    localStorage.setItem(

        "editPowerId",

        id

    );



    window.location.href =
    "powers-edit.html";


}









// =====================
// تنظيف الخانات
// =====================

function clearInputs(){



    document.getElementById(
        "fileNumber"
    ).value=getNextFileNumber();




    document.getElementById(
        "powerNumber"
    ).value="";




    document.getElementById(
        "clientName"
    ).value="";




    document.getElementById(
        "documentation"
    ).value="";



}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){



    let last=2432;



    powers.forEach(item=>{


        let num=Number(item.fileNumber);



        if(!isNaN(num)&&num>last){


            last=num;


        }


    });




    alert(
        "آخر رقم ملف هو: "+last
    );



}









// =====================
// الصفحات
// =====================

function createPagination(){



    let pagination =

    document.getElementById(
        "pagination"
    );



    if(!pagination)

    return;




    pagination.innerHTML="";



}






// =====================
// تشغيل
// =====================

if(

document.getElementById("powersTable")

){


    loadPowers();


}
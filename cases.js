// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// متغيرات
// =====================

let cases = [];

let currentData = [];

let currentPage = 1;

let rowsPerPage = 50;

let searchTimer;





// =====================
// تحميل القضايا
// =====================

async function loadCases(){


    try{


        let response = await fetch(
            `${API}/cases`
        );


        cases = await response.json();


        currentData = [];


        displayCases();


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



    cases.forEach(item=>{


        let num = Number(
            item.fileNumber
        );


        if(!isNaN(num) && num > last){

            last = num;

        }


    });



    return String(last + 1);


}









// =====================
// إضافة قضية
// =====================

async function addCase(){



    let fileNumber =
    document.getElementById(
        "fileNumber"
    ).value.trim();



    let caseNumber =
    document.getElementById(
        "caseNumber"
    ).value.trim();



    let clientName =
    document.getElementById(
        "clientName"
    ).value.trim();



    let court =
    document.getElementById(
        "court"
    ).value.trim();



    let caseType =
    document.getElementById(
        "caseType"
    ).value.trim();





    if(fileNumber===""){

        fileNumber =
        getNextFileNumber();

    }





    if(clientName===""){


        alert(
            "أدخل اسم الموكل"
        );


        return;

    }







    await fetch(

        `${API}/cases`,

        {

            method:"POST",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                fileNumber,

                caseNumber,

                clientName,

                court,

                caseType

            })


        }

    );




    alert(
        "تم إضافة القضية"
    );



    clearInputs();


    loadCases();



}









// =====================
// عرض البيانات
// =====================

function displayCases(){


    let table =
    document.getElementById(
        "casesTable"
    );



    if(!table)
    return;



    table.innerHTML="";



    let data =
    currentData.length
    ?
    currentData
    :
    cases;




    let start =
    (currentPage-1)
    *
    rowsPerPage;




    data.slice(

        start,

        start + rowsPerPage

    )

    .forEach(item=>{


        table.innerHTML += `


<tr>


<td>${item.fileNumber || ""}</td>


<td>${item.caseNumber || ""}</td>


<td>${item.clientName || ""}</td>


<td>${item.court || ""}</td>


<td>${item.caseType || ""}</td>



<td>

<button class="edit"

onclick="editCase(${item.id})">

تعديل

</button>


</td>




<td>

<button class="delete"

onclick="deleteCase(${item.id})">

حذف

</button>


</td>



</tr>


`;



    });



}









// =====================
// البحث
// =====================

function searchCases(){



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


        currentData =
        cases.filter(item=>{


            return (

                String(item.fileNumber)
                .includes(value)


                ||

                String(item.caseNumber)
                .toLowerCase()
                .includes(value)



                ||

                String(item.clientName)
                .toLowerCase()
                .includes(value)



                ||

                String(item.court)
                .toLowerCase()
                .includes(value)



                ||

                String(item.caseType)
                .toLowerCase()
                .includes(value)


            );


        });


    }




    currentPage=1;


    displayCases();



}






function delaySearch(){


    clearTimeout(searchTimer);


    searchTimer =
    setTimeout(()=>{


        searchCases();


    },500);


}









// =====================
// تعديل
// =====================

function editCase(id){



    localStorage.setItem(

        "editCaseId",

        id

    );



    window.location.href =
    "cases-edit.html";


}









// =====================
// حذف
// =====================

async function deleteCase(id){



    if(!confirm(
        "هل تريد حذف القضية؟"
    ))

    return;





    await fetch(

        `${API}/cases/${id}`,

        {

            method:"DELETE"

        }

    );



    loadCases();



}









// =====================
// تنظيف الخانات
// =====================

function clearInputs(){



    document.getElementById(
        "fileNumber"
    ).value =
    getNextFileNumber();



    document.getElementById(
        "caseNumber"
    ).value="";



    document.getElementById(
        "clientName"
    ).value="";



    document.getElementById(
        "court"
    ).value="";



    document.getElementById(
        "caseType"
    ).value="";


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){


    let last = 2432;


    cases.forEach(item=>{


        let num =
        Number(item.fileNumber);



        if(!isNaN(num)&&num>last){

            last=num;

        }


    });



    alert(
        "آخر رقم ملف هو: "+last
    );


}









// =====================
// تشغيل
// =====================

if(
document.getElementById("casesTable")
){

    loadCases();

}
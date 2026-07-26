// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";




// =====================
// متغيرات
// =====================

let cases = [];

let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let searchTimer;

let showingEmpty = false;









// =====================
// تحميل القضايا من السيرفر
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
// إضافة قضية
// =====================

async function addCase(){



    let fileNumber =

    document.getElementById("fileNumber")
    .value.trim();




    let clientName =

    document.getElementById("clientName")
    .value.trim();






    if(clientName === ""){


        alert(
            "أدخل اسم الموكل"
        );


        return;


    }






    try{


        let response = await fetch(

            `${API}/cases`,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    fileNumber:fileNumber,

                    clientName:clientName

                })

            }

        );






        await response.json();




        alert(
            "تم إضافة القضية"
        );





        clearInputs();



        loadCases();



    }

    catch(error){


        alert(
            "تعذر الاتصال بالسيرفر"
        );


    }



}









// =====================
// عرض القضايا
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







    data

    .slice(

        start,

        start+rowsPerPage

    )

    .forEach(item=>{



        table.innerHTML += `


<tr>


<td>

${item.fileNumber || ""}

</td>



<td>

${item.clientName || ""}

</td>



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




    createPagination();



}









// =====================
// البحث
// =====================

function searchCases(){



    let value =

    document.getElementById("search")

    .value

    .toLowerCase()

    .trim();







    if(value===""){


        currentData=[];


    }

    else{


        currentData = cases.filter(item=>{


            return (


                String(item.fileNumber)

                .toLowerCase()

                .includes(value)



                ||



                String(item.clientName)

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



    searchTimer=setTimeout(()=>{


        searchCases();



    },500);


}









// =====================
// حذف قضية
// =====================

async function deleteCase(id){



    if(!confirm("هل تريد حذف القضية؟"))

    return;





    try{


        await fetch(

            `${API}/cases/${id}`,

            {

                method:"DELETE"

            }

        );




        loadCases();



    }

    catch(error){


        alert(
            "تعذر الاتصال بالسيرفر"
        );


    }


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
// تنظيف
// =====================

function clearInputs(){



    document.getElementById(
        "fileNumber"
    ).value="";



    document.getElementById(
        "clientName"
    ).value="";



}









// =====================
// بيانات ناقصة
// =====================

function showEmptyCases(){



    if(showingEmpty){


        currentData=[];

        showingEmpty=false;



    }

    else{


        currentData = cases.filter(item=>{


            return (

                !item.fileNumber ||

                !item.clientName


            );


        });



        showingEmpty=true;


    }



    currentPage=1;


    displayCases();



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





    let data =

    currentData.length

    ?

    currentData

    :

    cases;





    let pages = Math.ceil(

        data.length /

        rowsPerPage

    );





    for(let i=1;i<=pages;i++){



        pagination.innerHTML += `

<button onclick="changePage(${i})">

${i}

</button>

`;



    }


}








function changePage(page){


    currentPage=page;


    displayCases();


}









// =====================
// تشغيل الصفحة
// =====================

if(

document.getElementById("casesTable")

){


    loadCases();


}
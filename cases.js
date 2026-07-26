// =====================
// تحميل البيانات
// =====================

let cases =
JSON.parse(localStorage.getItem("cases")) || [];


let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let searchTimer;






// =====================
// حساب رقم الملف القادم
// =====================

function getNextFileNumber(){


    let last = 2431;



    cases.forEach(item=>{


        let num =
        parseInt(item.fileNumber);



        if(!isNaN(num) && num > last){


            last = num;


        }


    });



    return String(last + 1);


}







// =====================
// إضافة ملف
// =====================

function addCase(){



    let fileNumber =
    document.getElementById("fileNumber")
    .value
    .trim();



    let clientName =
    document.getElementById("clientName")
    .value
    .trim();





    if(fileNumber === ""){


        fileNumber = getNextFileNumber();


    }






    if(clientName === ""){


        alert("أدخل اسم الموكل");


        return;


    }






    let newCase = {


        id:Date.now(),


        fileNumber:fileNumber,


        clientName:clientName


    };





    cases.push(newCase);



    localStorage.setItem(

        "cases",

        JSON.stringify(cases)

    );





    alert("تم إضافة الملف بنجاح");



    clearInputs();



    currentData = [];



    displayCases();



}











// =====================
// عرض البيانات
// =====================

function displayCases(){



    let table =
    document.getElementById("casesTable");



    if(!table)
    return;



    table.innerHTML = "";





    let start =
    (currentPage - 1) * rowsPerPage;



    let data =
    currentData.slice(

        start,

        start + rowsPerPage

    );






    data.forEach(item=>{



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






    if(value === ""){


        currentData = [];



    }

    else{


        currentData =

        cases.filter(item=>{


            return (

                String(item.fileNumber || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.clientName || "")
                .toLowerCase()
                .includes(value)


            );


        });


    }





    currentPage = 1;



    displayCases();



}








function delaySearch(){


    clearTimeout(searchTimer);



    searchTimer = setTimeout(()=>{


        searchCases();


    },500);



}









// =====================
// حذف
// =====================

function deleteCase(id){



    if(confirm("هل تريد حذف الملف؟")){



        cases =

        cases.filter(

            item=>item.id != id

        );




        localStorage.setItem(

            "cases",

            JSON.stringify(cases)

        );



        currentData = [];



        displayCases();



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
// تنظيف الخانات
// =====================

function clearInputs(){



    document.getElementById("fileNumber")
    .value = getNextFileNumber();



    document.getElementById("clientName")
    .value = "";



}









// =====================
// الصفحات
// =====================

function createPagination(){



    let pagination =

    document.getElementById("pagination");



    if(!pagination)

    return;




    pagination.innerHTML="";




    let pages =

    Math.ceil(

        currentData.length /

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


    currentPage = page;


    displayCases();


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){



    alert(

        "آخر رقم ملف هو: "

        +

        getNextFileNumber()

    );


}









// =====================
// تشغيل الصفحة
// =====================

if(document.getElementById("casesTable")){


    currentData = [];


    displayCases();



}







// إظهار رقم الملف القادم

if(document.getElementById("fileNumber")){


    document.getElementById("fileNumber").value =

    getNextFileNumber();


}
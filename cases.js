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
// إضافة ملف
// =====================

function addCase(){


    let fileNumber =
    document.getElementById("fileNumber")
    .value.trim();



    let clientName =
    document.getElementById("clientName")
    .value.trim();





    if(
        fileNumber === "" ||
        clientName === ""
    ){

        alert("أدخل رقم الملف واسم الموكل");

        return;

    }






    let newCase = {

        id: Date.now(),

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



}









// =====================
// عرض الملفات
// =====================

function displayCases(){


    let table =
    document.getElementById("casesTable");



    if(!table)
    return;




    table.innerHTML="";




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

function delaySearch(){



    clearTimeout(searchTimer);



    searchTimer = setTimeout(()=>{


        searchCases();



    },300);



}








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


        currentData = cases.filter(item=>{


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
// حذف
// =====================

function deleteCase(id){



    if(confirm("هل تريد حذف الملف؟")){


        cases = cases.filter(

            c=>c.id != id

        );



        localStorage.setItem(

            "cases",

            JSON.stringify(cases)

        );



        currentData=[];



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



    document.getElementById("fileNumber").value="";


    document.getElementById("clientName").value="";



}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){



    if(cases.length===0){


        alert("لا يوجد ملفات مسجلة");


        return;


    }





    let nums = cases.map(c=>


        Number(c.fileNumber)||0


    );




    alert(

        "آخر رقم ملف هو: " +

        Math.max(...nums)

    );



}









// =====================
// تشغيل الصفحة
// =====================

if(
document.getElementById("casesTable")
){


    currentData=[];


    displayCases();


}
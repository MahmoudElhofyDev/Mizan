// =====================================
// MIZAN - CASES.JS
// Railway Version - Fixed
// =====================================


// =====================================
// API
// =====================================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================================
// المتغيرات
// =====================================

let allCases = [];

let filteredCases = [];

let currentPage = 1;

const rowsPerPage = 50;

let currentEditId = null;



// =====================================
// تشغيل الصفحة
// =====================================

window.onload = function(){

    hideTable();

    bindEvents();

    loadAllCases();

};



// =====================================
// ربط الأحداث
// =====================================

function bindEvents(){


    const lastBtn =
    document.getElementById("lastFileBtn");


    if(lastBtn){

        lastBtn.onclick =
        showLastFileNumber;

    }



    const searchInput =
    document.getElementById("searchInput");


    if(searchInput){

        searchInput.addEventListener(

            "keyup",

            function(){

                searchCases();

            }

        );

    }


}



// =====================================
// إخفاء الجدول
// =====================================

function hideTable(){


    const body =
    document.getElementById("casesBody");


    if(body){

        body.innerHTML = "";

    }



    const pagination =
    document.getElementById("pagination");


    if(pagination){

        pagination.innerHTML = "";

    }


}






// =====================================
// البحث
// =====================================

function searchCases(){


    const input =
    document.getElementById("searchInput");


    if(!input) return;



    const keyword =

    input.value

    .trim()

    .toLowerCase();



    if(keyword === ""){

        hideTable();

        return;

    }



    filteredCases =

    allCases.filter(c=>{


        return (


            String(
                c.file_number || ""
            )

            .toLowerCase()

            .includes(keyword)



            ||



            String(
                c.client_name || ""
            )

            .toLowerCase()

            .includes(keyword)


        );


    });



    currentPage = 1;


    renderCases();


}






// =====================================
// عرض البيانات
// =====================================

function renderCases(){


    const body =
    document.getElementById("casesBody");


    if(!body) return;



    body.innerHTML = "";



    if(filteredCases.length === 0){


        body.innerHTML = `

<tr>

<td colspan="4">

لا توجد نتائج

</td>

</tr>

`;

        document
        .getElementById("pagination")
        .innerHTML="";


        return;

    }



    const start =

    (currentPage - 1)

    * rowsPerPage;



    const data =

    filteredCases.slice(

        start,

        start + rowsPerPage

    );



    data.forEach(c=>{


        body.innerHTML += `


<tr>


<td>

${c.file_number}

</td>



<td>

${c.client_name}

</td>



<td>

<button

class="edit"

onclick="openEditModal(${c.id})">

تعديل

</button>

</td>




<td>

<button

class="delete"

onclick="deleteCase(${c.id})">

حذف

</button>

</td>


</tr>


`;



    });



    renderPagination();


}

// =====================================
// الصفحات
// =====================================

function renderPagination(){


    const pagination =
    document.getElementById("pagination");


    if(!pagination) return;



    pagination.innerHTML = "";



    const totalPages =

    Math.ceil(

        filteredCases.length /

        rowsPerPage

    );



    if(totalPages <= 1){

        return;

    }



    pagination.innerHTML += `

<button

onclick="prevPage()"

${currentPage === 1 ? "disabled" : ""}>

◀

</button>

`;



    for(let i = 1; i <= totalPages; i++){


        pagination.innerHTML += `

<button

class="${i === currentPage ? "active" : ""}"

onclick="goPage(${i})">

${i}

</button>

`;


    }



    pagination.innerHTML += `

<button

onclick="nextPage()"

${currentPage === totalPages ? "disabled" : ""}>

▶

</button>

`;


}





function goPage(page){

    currentPage = page;

    renderCases();

}




function nextPage(){


    const totalPages =

    Math.ceil(

        filteredCases.length /

        rowsPerPage

    );



    if(currentPage < totalPages){

        currentPage++;

        renderCases();

    }


}




function prevPage(){


    if(currentPage > 1){

        currentPage--;

        renderCases();

    }


}





// =====================================
// إعادة البحث
// =====================================

function clearSearch(){


    const input =

    document.getElementById("searchInput");


    if(input){

        input.value = "";

    }


    filteredCases = [];


    hideTable();


}






// =====================================
// فتح نافذة الإضافة
// =====================================

function openAddModal(){


    const modal =

    document.getElementById("addModal");



    if(modal){

        modal.style.display = "flex";

    }


}




// =====================================
// غلق نافذة الإضافة
// =====================================

function closeAddModal(){


    const modal =

    document.getElementById("addModal");



    if(modal){

        modal.style.display = "none";

    }


}





// =====================================
// حفظ ملف جديد
// =====================================

async function saveCase(){


    const file_number =

    document

    .getElementById("fileNumber")

    .value

    .trim();



    const client_name =

    document

    .getElementById("clientName")

    .value

    .trim();




    if(

        file_number === "" ||

        client_name === ""

    ){

        alert("يرجى إدخال جميع البيانات");

        return;

    }




    const exists =

    allCases.find(c =>

        String(c.file_number)

        ===

        String(file_number)

    );



    if(exists){

        alert("رقم الملف موجود بالفعل");

        return;

    }




    try{


        const response =

        await fetch(

            API + "/cases",

            {

                method:"POST",


                headers:{


                    "Content-Type":

                    "application/json"


                },


                body:

                JSON.stringify({

                    file_number,

                    client_name

                })


            }

        );



        const data =

        await response.json();




        if(data.success){



            showToast(

                "تمت إضافة الملف"

            );



            document

            .getElementById("fileNumber")

            .value="";



            document

            .getElementById("clientName")

            .value="";



            closeAddModal();



            loadAllCases();


        }

        else{


            alert(

                data.message ||

                "فشل الإضافة"

            );


        }



    }

    catch(err){


        console.log(err);


        alert(

            "تعذر الاتصال بالسيرفر"

        );


    }


}






// =====================================
// آخر رقم ملف
// =====================================

async function showLastFileNumber(){


    try{


        const response =

        await fetch(

            API +

            "/cases/last-file"

        );



        const data =

        await response.json();




        document

        .getElementById("lastFileValue")

        .innerText =

        data.lastFile || 0;




        document

        .getElementById("lastFileModal")

        .style.display="flex";



    }


    catch(err){


        alert(

            "تعذر جلب آخر رقم ملف"

        );


    }


}




function closeLastFileModal(){


    document

    .getElementById("lastFileModal")

    .style.display="none";


}

// =====================================
// فتح التعديل
// =====================================

function openEditModal(id){


    const c =

    filteredCases.find(

        x => x.id == id

    );



    if(!c){

        return;

    }



    currentEditId = id;



    const fileNumber =

    prompt(

        "رقم الملف",

        c.file_number

    );



    if(fileNumber === null){

        return;

    }



    const clientName =

    prompt(

        "اسم الموكل",

        c.client_name

    );



    if(clientName === null){

        return;

    }



    updateCase(

        id,

        fileNumber,

        clientName

    );


}






// =====================================
// تحديث الملف
// =====================================

async function updateCase(

    id,

    file_number,

    client_name

){


    try{


        const response =

        await fetch(

            API +

            "/cases/" +

            id,

            {


                method:"PUT",



                headers:{


                    "Content-Type":

                    "application/json"


                },



                body:

                JSON.stringify({

                    file_number,

                    client_name

                })


            }

        );




        const data =

        await response.json();




        if(data.success){


            showToast(

                "تم تعديل الملف"

            );


            loadAllCases();


        }

        else{


            alert(

                "فشل التعديل"

            );


        }



    }

    catch(err){


        console.log(err);


        alert(

            "حدث خطأ أثناء التعديل"

        );


    }


}






// =====================================
// حذف ملف
// =====================================

async function deleteCase(id){


    if(

        !confirm(

            "هل تريد حذف هذا الملف؟"

        )

    ){

        return;

    }



    try{


        const response =

        await fetch(

            API +

            "/cases/" +

            id,

            {

                method:"DELETE"

            }

        );



        const data =

        await response.json();




        if(data.success){


            showToast(

                "تم حذف الملف"

            );



            loadAllCases();


        }

        else{


            alert(

                "فشل الحذف"

            );


        }



    }

    catch(err){


        console.log(err);


        alert(

            "تعذر الاتصال بالسيرفر"

        );


    }


}








// =====================================
// عرض البيانات الناقصة
// =====================================

function showIncompleteCases(){


    filteredCases =

    allCases.filter(c=>{


        return (

            !c.file_number ||

            !c.client_name

        );


    });



    currentPage = 1;


    renderCases();


}








// =====================================
// تحميل البيانات
// =====================================

async function loadAllCases(){

    try{

        const response =
        await fetch(
            API + "/cases"
        );


        const data =
        await response.json();



        if(Array.isArray(data)){

            allCases = data;

        }

        else if(Array.isArray(data.cases)){

            allCases = data.cases;

        }

        else{

            allCases = [];

            console.log(
                "Unexpected API response:",
                data
            );

        }



    }

    catch(err){

        console.log(err);

        allCases = [];

    }

}








// =====================================
// Toast
// =====================================

function showToast(text){



    let toast =

    document.getElementById(

        "toast"

    );




    if(!toast){



        toast =

        document.createElement(

            "div"

        );



        toast.id = "toast";



        document.body.appendChild(

            toast

        );


    }





    toast.innerText = text;



    toast.style.display="block";



    setTimeout(()=>{


        toast.style.display="none";


    },2000);



}
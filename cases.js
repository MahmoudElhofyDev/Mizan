// =====================================
// MIZAN - CASES.JS
// Railway Version
// =====================================

// =====================================
// API
// =====================================

const API =
"https://mizan-production-32bb.up.railway.app";


// =====================================
// متغيرات
// =====================================

let allCases = [];

let filteredCases = [];

let currentPage = 1;

const rowsPerPage = 50;

let currentEditId = null;


// =====================================
// تحميل الصفحة
// =====================================

window.onload = () => {

    hideTable();

    bindEvents();

};



// =====================================
// ربط الأحداث
// =====================================

function bindEvents(){

    const searchBtn =
    document.getElementById("searchBtn");

    if(searchBtn){

        searchBtn.onclick = searchCases;

    }


    const searchInput =
    document.getElementById("search");

    if(searchInput){

        searchInput.addEventListener(

            "keydown",

            function(e){

                if(e.key==="Enter"){

                    searchCases();

                }

            }

        );

    }

}



// =====================================
// إخفاء الجدول
// =====================================

function hideTable(){

    const table =
    document.getElementById("casesTable");

    if(table){

        table.innerHTML="";

    }


    const pagination =
    document.getElementById("pagination");

    if(pagination){

        pagination.innerHTML="";

    }

}



// =====================================
// البحث
// =====================================

async function searchCases(){

    const keyword =

    document

    .getElementById("search")

    .value

    .trim()

    .toLowerCase();



    if(keyword===""){

        hideTable();

        return;

    }



    try{

        const response =

        await fetch(

            API + "/cases"

        );



        allCases =

        await response.json();



        filteredCases =

        allCases.filter(c=>{


            return(


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



                ||



                String(

                    c.documentation || ""

                )

                .toLowerCase()

                .includes(keyword)



                ||



                String(

                    c.power_number || ""

                )

                .toLowerCase()

                .includes(keyword)



            );


        });



        currentPage = 1;



        renderCases();



    }

    catch(err){

        console.log(err);

        alert("تعذر الاتصال بالسيرفر");

    }

}

// =====================================
// عرض البيانات
// =====================================

function renderCases(){

    const body =
    document.getElementById("casesTable");

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
        .innerHTML = "";

        return;

    }


    const start =

    (currentPage - 1)

    * rowsPerPage;



    const end =

    start +

    rowsPerPage;



    const pageData =

    filteredCases.slice(

        start,

        end

    );



    pageData.forEach(c=>{


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

    document.getElementById(

        "pagination"

    );



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

${currentPage==1?"disabled":""}>

◀

</button>

`;



    for(

        let i=1;

        i<=totalPages;

        i++

    ){

        pagination.innerHTML += `

<button

class="${
i==currentPage
?
'active'
:
''
}"

onclick="goPage(${i})">

${i}

</button>

`;

    }



    pagination.innerHTML += `

<button

onclick="nextPage()"

${currentPage==totalPages?"disabled":""}>

▶

</button>

`;

}



// =====================================
// الانتقال للصفحات
// =====================================

function goPage(page){

    currentPage = page;

    renderCases();

}



function nextPage(){

    const totalPages =

    Math.ceil(

        filteredCases.length

        / rowsPerPage

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
// إعادة تعيين البحث
// =====================================

function clearSearch(){

    document
    .getElementById("search")
    .value = "";

    filteredCases = [];

    hideTable();

}

// =====================================
// إضافة ملف جديد
// =====================================

async function addCase(){

    const file_number =
    document.getElementById("fileNumber")
    .value.trim();

    const client_name =
    document.getElementById("clientName")
    .value.trim();

    if(file_number==="" || client_name===""){

        alert("يرجى إدخال جميع البيانات");

        return;

    }

    // منع تكرار رقم الملف

    const exists =
    allCases.find(c =>

        String(c.file_number) ===
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

                body:JSON.stringify({

                    file_number,

                    client_name

                })

            }

        );

        const data =
        await response.json();

        if(data.success){

            showToast("تمت إضافة الملف");

            document
            .getElementById("fileNumber")
            .value="";

            document
            .getElementById("clientName")
            .value="";

            searchCases();

        }

        else{

            alert(data.message || "فشل الإضافة");

        }

    }

    catch(err){

        console.log(err);

        alert("تعذر الاتصال بالسيرفر");

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

        alert(

            "آخر رقم ملف : " +

            data.lastFile

        );

    }

    catch{

        alert("تعذر جلب آخر رقم");

    }

}



// =====================================
// فتح نافذة التعديل
// =====================================

function openEditModal(id){

    currentEditId = id;

    const c =
    filteredCases.find(

        x => x.id == id

    );

    if(!c) return;

    const fileNumber =
    prompt(

        "رقم الملف",

        c.file_number

    );

    if(fileNumber===null){

        return;

    }

    const clientName =
    prompt(

        "اسم الموكل",

        c.client_name

    );

    if(clientName===null){

        return;

    }

    updateCase(

        id,

        fileNumber,

        clientName

    );

}



// =====================================
// حفظ التعديل
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

                body:JSON.stringify({

                    file_number,

                    client_name

                })

            }

        );

        const data =
        await response.json();

        if(data.success){

            showToast("تم حفظ التعديل");

            searchCases();

        }

        else{

            alert("فشل التعديل");

        }

    }

    catch(err){

        console.log(err);

    }

}

// =====================================
// حذف ملف
// =====================================

async function deleteCase(id){

    if(!confirm("هل تريد حذف هذا الملف؟")){

        return;

    }

    try{

        const response =
        await fetch(

            API + "/cases/" + id,

            {

                method:"DELETE"

            }

        );

        const data =
        await response.json();

        if(data.success){

            showToast("تم حذف الملف");

            searchCases();

        }

        else{

            alert("فشل الحذف");

        }

    }

    catch(err){

        console.log(err);

        alert("تعذر الاتصال بالسيرفر");

    }

}



// =====================================
// عرض البيانات الناقصة
// =====================================

function showIncompleteCases(){

    filteredCases = allCases.filter(c=>{

        return(

            !c.file_number ||

            !c.client_name

        );

    });

    currentPage = 1;

    renderCases();

}



// =====================================
// عرض الملفات بدون توكيل
// =====================================

function showCasesWithoutPower(){

    filteredCases = allCases.filter(c=>{

        return(

            !c.power_number ||

            c.power_number==="" ||

            c.power_number===null

        );

    });

    currentPage = 1;

    renderCases();

}



// =====================================
// Toast
// =====================================

function showToast(text){

    let toast =

    document.getElementById("toast");

    if(!toast){

        toast =

        document.createElement("div");

        toast.id = "toast";

        toast.style.position = "fixed";

        toast.style.bottom = "20px";

        toast.style.left = "20px";

        toast.style.background = "#198754";

        toast.style.color = "#fff";

        toast.style.padding = "12px 20px";

        toast.style.borderRadius = "8px";

        toast.style.zIndex = "99999";

        toast.style.fontSize = "15px";

        document.body.appendChild(toast);

    }

    toast.innerText = text;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}



// =====================================
// تحميل كل البيانات
// =====================================

async function loadAllCases(){

    try{

        const response =

        await fetch(

            API + "/cases"

        );

        allCases =

        await response.json();

    }

    catch(err){

        console.log(err);

    }

}



// =====================================
// تشغيل الصفحة
// =====================================

window.addEventListener(

    "load",

    loadAllCases

);
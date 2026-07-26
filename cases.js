const API =
"https://mizan-production-32bb.up.railway.app";



let cases = [];

let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];




// =====================
// تحميل البيانات
// =====================

async function loadCases(){

    try{

        let res =
        await fetch(`${API}/cases`);


        cases =
        await res.json();


        displayCases();


    }
    catch(err){

        console.log(err);

        alert("تعذر تحميل البيانات");

    }

}





// =====================
// إضافة ملف
// =====================

async function addCase(){


    let fileNumber =
    document.getElementById("fileNumber")
    .value.trim();



    let clientName =
    document.getElementById("clientName")
    .value.trim();




    if(fileNumber==="" || clientName===""){

        alert("أدخل رقم الملف واسم الموكل");

        return;

    }




    await fetch(`${API}/cases`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            fileNumber,

            clientName

        })

    });




    clearInputs();


    loadCases();


}







// =====================
// عرض البيانات
// =====================

function displayCases(){


    let table =
    document.getElementById("casesTable");


    if(!table)
    return;



    table.innerHTML="";



    let data =
    currentData.length ?
    currentData :
    cases;



    let start =
    (currentPage-1)*rowsPerPage;



    let rows =
    data.slice(
        start,
        start+rowsPerPage
    );




    rows.forEach(c=>{


        table.innerHTML += `

<tr>

<td>${c.fileNumber || ""}</td>

<td>${c.clientName || ""}</td>


<td>

<button onclick="editCase(${c.id})">

تعديل

</button>

</td>



<td>

<button onclick="deleteCase(${c.id})">

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


        currentData =
        cases.filter(c=>{


            return (

                String(c.fileNumber)
                .toLowerCase()
                .includes(value)


                ||

                String(c.clientName)
                .toLowerCase()
                .includes(value)


            );


        });


    }



    currentPage=1;


    displayCases();


}









// =====================
// حذف
// =====================

async function deleteCase(id){


    if(confirm("هل تريد حذف الملف؟")){


        await fetch(
            `${API}/cases/${id}`,
            {
                method:"DELETE"
            }
        );


        loadCases();


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
// آخر رقم ملف
// =====================

function showLastFileNumber(){


    if(cases.length===0){

        alert("لا يوجد ملفات");

        return;

    }



    let max=0;



    cases.forEach(c=>{


        let n =
        Number(c.fileNumber);



        if(!isNaN(n) && n>max){

            max=n;

        }


    });



    alert(
        "آخر رقم ملف هو: "+max
    );


}








// =====================
// تنظيف
// =====================

function clearInputs(){

    document.getElementById("fileNumber").value="";

    document.getElementById("clientName").value="";

}








// =====================
// الصفحات
// =====================

function createPagination(){


    let box =
    document.getElementById("pagination");


    if(!box)
    return;



    box.innerHTML="";



    let data =
    currentData.length ?
    currentData :
    cases;



    let pages =
    Math.ceil(
        data.length / rowsPerPage
    );



    for(let i=1;i<=pages;i++){


        box.innerHTML += `

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





// تشغيل

loadCases();
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
        cases.filter(item=>{


            return (

                String(item.fileNumber || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.clientName || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.opponent || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.court || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.type || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.documentation || "")
                .toLowerCase()
                .includes(value)

            );


        });


    }



    currentPage = 1;


    displayCases();


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){


    if(cases.length===0){

        alert("لا يوجد ملفات");

        return;

    }



    let max = 0;



    cases.forEach(c=>{


        let num =
        Number(c.fileNumber);



        if(
            !isNaN(num)
            &&
            num > max
        ){

            max = num;

        }


    });



    alert(
        "آخر رقم ملف هو: " + max
    );


}









// =====================
// حذف
// =====================

function deleteCase(id){



    if(confirm("هل تريد حذف الملف؟")){


        cases =
        cases.filter(
            c => c.id != id
        );



        saveCases();



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


    document.getElementById("opponent").value="";


    document.getElementById("court").value="";


    document.getElementById("caseType").value="";


    document.getElementById("birthDate").value="";


    document.getElementById("documentation").value="";


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



    let data =
    currentData.length ?
    currentData :
    cases;



    let pages =
    Math.ceil(
        data.length / rowsPerPage
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
// تشغيل
// =====================

if(
document.getElementById("casesTable")
){


    displayCases();


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
        cases.filter(item=>{


            return (

                String(item.fileNumber || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.clientName || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.opponent || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.court || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.type || "")
                .toLowerCase()
                .includes(value)


                ||

                String(item.documentation || "")
                .toLowerCase()
                .includes(value)

            );


        });


    }



    currentPage = 1;


    displayCases();


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){


    if(cases.length===0){

        alert("لا يوجد ملفات");

        return;

    }



    let max = 0;



    cases.forEach(c=>{


        let num =
        Number(c.fileNumber);



        if(
            !isNaN(num)
            &&
            num > max
        ){

            max = num;

        }


    });



    alert(
        "آخر رقم ملف هو: " + max
    );


}









// =====================
// حذف
// =====================

function deleteCase(id){



    if(confirm("هل تريد حذف الملف؟")){


        cases =
        cases.filter(
            c => c.id != id
        );



        saveCases();



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


    document.getElementById("opponent").value="";


    document.getElementById("court").value="";


    document.getElementById("caseType").value="";


    document.getElementById("birthDate").value="";


    document.getElementById("documentation").value="";


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



    let data =
    currentData.length ?
    currentData :
    cases;



    let pages =
    Math.ceil(
        data.length / rowsPerPage
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
// تشغيل
// =====================

if(
document.getElementById("casesTable")
){


    displayCases();


}
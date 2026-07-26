// =====================
// تحميل البيانات
// =====================

let powers =
JSON.parse(localStorage.getItem("powers")) || [];


let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let searchTimer;

let showingEmpty = false;





// =====================
// رقم الملف القادم
// =====================

function getNextFileNumber(){


    let last = 2432;



    powers.forEach(item=>{


        let num = Number(item.fileNumber);



        if(!isNaN(num) && num > last){


            last = num;


        }


    });



    return String(last + 1);


}









// =====================
// إضافة توكيل
// =====================

function addPower(){


    let documentation =
    document.getElementById("documentation")
    .value.trim();



    let clientName =
    document.getElementById("clientName")
    .value.trim();



    let powerNumber =
    document.getElementById("powerNumber")
    .value.trim();



    let fileNumber =
    document.getElementById("fileNumber")
    .value.trim();





    if(fileNumber === ""){

        fileNumber = getNextFileNumber();

    }





    if(clientName === ""){

        alert("أدخل اسم الموكل");

        return;

    }





    let newPower = {


        id:Date.now(),


        fileNumber:fileNumber,


        powerNumber:powerNumber,


        clientName:clientName,


        documentation:documentation



    };





    powers.push(newPower);





    localStorage.setItem(

        "powers",

        JSON.stringify(powers)

    );





    alert("تم إضافة التوكيل بنجاح");





    clearInputs();


    currentData=[];


    displayPowers();



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





    let start =

    (currentPage - 1) * rowsPerPage;




    let data =

    currentData.slice(

        start,

        start + rowsPerPage

    );







    data.forEach(power=>{


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

    document.getElementById("search")

    .value

    .toLowerCase()

    .trim();





    if(value === ""){


        currentData=[];


    }

    else{


        currentData = powers.filter(item=>{


            return (


                String(item.fileNumber || "")
                .toLowerCase()
                .includes(value)



                ||



                String(item.powerNumber || "")
                .toLowerCase()
                .includes(value)



                ||



                String(item.clientName || "")
                .toLowerCase()
                .includes(value)



                ||



                String(item.documentation || "")
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

function deletePower(id){



    if(confirm("هل تريد حذف التوكيل؟")){


        powers = powers.filter(

            item=>item.id != id

        );



        localStorage.setItem(

            "powers",

            JSON.stringify(powers)

        );



        currentData=[];


        displayPowers();


    }


}









// =====================
// تعديل
// =====================

function editPower(id){


    localStorage.setItem(

        "editPowerId",

        id

    );



    window.location.href="powers-edit.html";


}









// =====================
// تنظيف الخانات
// =====================

function clearInputs(){



    document.getElementById(
        "documentation"
    ).value="";



    document.getElementById(
        "clientName"
    ).value="";



    document.getElementById(
        "powerNumber"
    ).value="";



    document.getElementById(
        "fileNumber"
    ).value=getNextFileNumber();



}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){



    let last = 2432;



    powers.forEach(item=>{


        let num = Number(item.fileNumber);



        if(!isNaN(num) && num > last){


            last=num;


        }


    });




    alert(

        "آخر رقم ملف هو: " + last

    );


}









// =====================
// البيانات الناقصة
// =====================

function showEmptyPowers(){



    if(showingEmpty){


        currentData=[];


        showingEmpty=false;



    }

    else{


        currentData=powers.filter(item=>{


            return (

                !item.fileNumber ||

                !item.powerNumber ||

                !item.clientName ||

                !item.documentation


            );


        });



        showingEmpty=true;



    }





    currentPage=1;


    displayPowers();



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



    let pages = Math.ceil(

        currentData.length / rowsPerPage

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


    displayPowers();


}









// =====================
// تشغيل الصفحة
// =====================

if(document.getElementById("powersTable")){


    currentData=[];


    displayPowers();


}






if(document.getElementById("fileNumber")){


    document.getElementById("fileNumber").value =

    getNextFileNumber();


}
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
// حفظ البيانات
// =====================

function savePowers(){

    localStorage.setItem(
        "powers",
        JSON.stringify(powers)
    );

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






    if(clientName===""){


        alert("أدخل اسم الموكل");


        return;


    }







    if(fileNumber===""){


        fileNumber=getNextFileNumber();


    }







    let newPower={


        id:Date.now(),


        documentation:documentation,


        clientName:clientName,


        powerNumber:powerNumber,


        fileNumber:fileNumber


    };






    powers.push(newPower);



    savePowers();



    alert("تم إضافة التوكيل بنجاح");



    clearInputs();


}









// =====================
// رقم الملف القادم
// =====================

function getNextFileNumber(){


    let last = 2431;



    powers.forEach(p=>{


        let num = Number(
            String(p.fileNumber).trim()
        );



        if(
            !isNaN(num) &&
            num > last
        ){

            last=num;

        }


    });



    return String(last + 1);


}









// =====================
// عرض التوكيلات
// =====================

function displayPowers(){


    let table =
    document.getElementById("powersTable");



    if(!table)
    return;



    table.innerHTML="";



    let start =
    (currentPage-1)*rowsPerPage;




    let data =
    currentData.slice(

        start,

        start + rowsPerPage

    );





    data.forEach(power=>{


        table.innerHTML += `

<tr>


<td>

${power.documentation || ""}

</td>



<td>

${power.clientName || ""}

</td>



<td>

${power.powerNumber || ""}

</td>



<td>

${power.fileNumber || ""}

</td>





<td>

<button class="edit"

onclick="goEditPower(${power.id})">

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

function delaySearch(){



    clearTimeout(searchTimer);



    searchTimer=setTimeout(()=>{


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
            powers.filter(p=>{


                return (


                    String(p.documentation)
                    .toLowerCase()
                    .includes(value)



                    ||



                    String(p.clientName)
                    .toLowerCase()
                    .includes(value)



                    ||



                    String(p.powerNumber)
                    .toLowerCase()
                    .includes(value)



                    ||



                    String(p.fileNumber)
                    .toLowerCase()
                    .includes(value)


                );


            });



        }




        currentPage=1;


        displayPowers();



    },300);



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
// حذف
// =====================

function deletePower(id){



    if(confirm("هل تريد حذف التوكيل؟")){


        powers =
        powers.filter(
            p=>p.id != id
        );



        savePowers();



        currentData=[];


        displayPowers();


    }


}









// =====================
// تعديل
// =====================

function goEditPower(id){



    localStorage.setItem(
        "editPowerId",
        id
    );



    window.location.href =
    "powers-edit.html";


}









// =====================
// تنظيف
// =====================

function clearInputs(){


    document.getElementById("documentation").value="";


    document.getElementById("clientName").value="";


    document.getElementById("powerNumber").value="";


    document.getElementById("fileNumber").value =
    getNextFileNumber();


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){



    if(powers.length===0){


        alert("لا يوجد توكيلات مسجلة");


        return;


    }




    let maxNumber=0;



    powers.forEach(p=>{


        let num =
        Number(
            String(p.fileNumber)
            .trim()
        );



        if(
            !isNaN(num) &&
            num > maxNumber
        ){

            maxNumber=num;

        }


    });





    alert(
        "آخر رقم ملف هو: " + maxNumber
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


        currentData =
        powers.filter(p=>{


            return (

                !p.documentation ||

                !p.clientName ||

                !p.powerNumber ||

                !p.fileNumber


            );


        });



        showingEmpty=true;



    }





    currentPage=1;


    displayPowers();



}









// =====================
// تشغيل الصفحة
// =====================

if(
document.getElementById("powersTable")
){


    currentData=[];


    displayPowers();


}





if(
document.getElementById("fileNumber")
){


    document.getElementById("fileNumber").value =
    getNextFileNumber();


}
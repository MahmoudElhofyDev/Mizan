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


    currentData=[];

    displayPowers();


}









// =====================
// استيراد Excel
// =====================

function importPowersExcel(){


    let file =
    document.getElementById("excelFile")
    .files[0];



    if(!file){

        alert("اختر ملف Excel");

        return;

    }




    let reader = new FileReader();



    reader.onload=function(e){


        let data =
        new Uint8Array(e.target.result);



        let workbook =
        XLSX.read(data,{
            type:"array"
        });



        let sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];



        let rows =
        XLSX.utils.sheet_to_json(
            sheet,
            {
                header:1
            }
        );



        let imported=[];



        rows.forEach((row,index)=>{


            if(index===0)
            return;



            if(
                row[0] &&
                row[1]
            ){


                imported.push({

                    id:Date.now()+index,

                    documentation:String(row[0]),

                    clientName:String(row[1]),

                    powerNumber:String(row[2] || ""),

                    fileNumber:String(row[3] || "")

                });


            }


        });






        if(imported.length===0){


            alert("ملف Excel غير صحيح");


            return;


        }






        powers = imported;



        savePowers();




        alert(
            "تم استيراد "+imported.length+" توكيل"
        );




        currentData=[];


        displayPowers();



    };



    reader.readAsArrayBuffer(file);



}









// =====================
// رقم الملف القادم
// =====================

function getNextFileNumber(){



    let max=0;



    powers.forEach(p=>{


        let num =
        Number(p.fileNumber);



        if(
            !isNaN(num)
            &&
            num>max
        ){

            max=num;

        }


    });



    return String(max+1);


}









// =====================
// عرض البيانات
// =====================

function displayPowers(){



    let table =
    document.getElementById("powersTable");



    if(!table)
    return;




    table.innerHTML="";




    let data =
    currentData.length ?
    currentData :
    powers;




    let start =
    (currentPage-1)*rowsPerPage;



    data =
    data.slice(
        start,
        start+rowsPerPage
    );





    data.forEach(power=>{


        table.innerHTML+=`

<tr>


<td>${power.documentation || ""}</td>


<td>${power.clientName || ""}</td>


<td>${power.powerNumber || ""}</td>


<td>${power.fileNumber || ""}</td>



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
// حذف
// =====================

function deletePower(id){


    if(confirm("هل تريد حذف التوكيل؟")){


        powers =
        powers.filter(
            p=>p.id!=id
        );



        savePowers();


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


    window.location.href=
    "powers-edit.html";


}









// =====================
// تنظيف
// =====================

function clearInputs(){


    document.getElementById("documentation").value="";


    document.getElementById("clientName").value="";


    document.getElementById("powerNumber").value="";


    document.getElementById("fileNumber").value=
    getNextFileNumber();


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){



    if(powers.length===0){


        alert("لا يوجد توكيلات");

        return;

    }




    let max=0;



    powers.forEach(p=>{


        let num=
        Number(p.fileNumber);



        if(
            !isNaN(num)
            &&
            num>max
        ){

            max=num;

        }


    });




    alert(
        "آخر رقم ملف هو: "+max
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
    powers;



    let pages =
    Math.ceil(
        data.length / rowsPerPage
    );



    for(let i=1;i<=pages;i++){


        pagination.innerHTML+=`

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
// تشغيل
// =====================

if(
document.getElementById("powersTable")
){


    displayPowers();


}



if(
document.getElementById("fileNumber")
){

    document.getElementById("fileNumber").value =
    getNextFileNumber();

}
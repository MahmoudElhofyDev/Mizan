// =====================
// تحميل البيانات
// =====================

let cases =
JSON.parse(localStorage.getItem("cases")) || [];


let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];




// =====================
// حفظ البيانات
// =====================

function saveCases(){

    localStorage.setItem(
        "cases",
        JSON.stringify(cases)
    );

}





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

        id:Date.now(),

        fileNumber:fileNumber,

        clientName:clientName

    };





    cases.push(newCase);


    saveCases();



    alert("تم إضافة الملف بنجاح");


    clearInputs();


    currentData=[];

    displayCases();


}








// =====================
// استيراد Excel
// =====================

function importCasesExcel(){


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



            if(row[0] && row[1]){


                imported.push({

                    id:Date.now()+index,

                    fileNumber:String(row[0]),

                    clientName:String(row[1])

                });


            }



        });




        if(imported.length===0){

            alert("لم يتم العثور على بيانات صحيحة");

            return;

        }




        cases = imported;



        saveCases();



        alert(
            "تم استيراد "+imported.length+" ملف"
        );



        currentData=[];


        displayCases();



    };



    reader.readAsArrayBuffer(file);


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



    let data;



    if(currentData.length){

        data=currentData;

    }

    else{

        data=cases;

    }




    let start =
    (currentPage-1)*rowsPerPage;



    data =
    data.slice(
        start,
        start+rowsPerPage
    );





    data.forEach(item=>{


        table.innerHTML+=`

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


        currentData =
        cases.filter(item=>{


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


        let num =
        Number(c.fileNumber);



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
// حذف
// =====================

function deleteCase(id){



    if(confirm("هل تريد حذف الملف؟")){


        cases =
        cases.filter(
            c=>c.id!=id
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


    window.location.href=
    "cases-edit.html";


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
        data.length /
        rowsPerPage
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
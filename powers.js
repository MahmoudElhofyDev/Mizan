// =====================
// تحميل البيانات
// =====================

let powers =
JSON.parse(localStorage.getItem("powers")) || [];




// =====================
// تثبيت شكل البيانات
// =====================

powers = powers.map(p=>{

    return {

        id: p.id || Date.now(),

        fileNumber: p.fileNumber || "",

        powerNumber: p.powerNumber || "",

        clientName: p.clientName || "",

        documentation: p.documentation || ""

    };

});


localStorage.setItem(
    "powers",
    JSON.stringify(powers)
);





let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let showingEmpty = false;

let searchTimer;






// =====================
// رقم الملف القادم
// =====================

function getNextFileNumber(){


    let last = 2431;



    powers.forEach(p=>{


        let num = Number(p.fileNumber);



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


    let fileNumber =
    document.getElementById("fileNumber").value.trim();



    let powerNumber =
    document.getElementById("powerNumber").value.trim();



    let clientName =
    document.getElementById("clientName").value.trim();



    let documentation =
    document.getElementById("documentation").value.trim();




    if(clientName===""){


        alert("أدخل اسم الموكل");


        return;

    }




    if(fileNumber===""){


        fileNumber=getNextFileNumber();


    }






    powers.push({

        id:Date.now(),

        fileNumber,

        powerNumber,

        clientName,

        documentation

    });





    savePowers();



    alert("تم إضافة التوكيل بنجاح");



    clearInputs();



}









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
// استيراد Excel
// =====================

function importExcel(){



    let file =
    document.getElementById("excelFile").files[0];



    if(!file){


        alert("اختر ملف Excel أولاً");


        return;

    }




    let reader = new FileReader();



    reader.onload=function(e){



        let data =
        new Uint8Array(e.target.result);



        let workbook =
        XLSX.read(data,{type:"array"});



        let sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];



        let rows =
        XLSX.utils.sheet_to_json(
            sheet,
            {header:1}
        );



        let count=0;



        rows.forEach((row,index)=>{



            if(index===0)
            return;



            if(
                !row[0] &&
                !row[1] &&
                !row[2] &&
                !row[3]
            )
            return;




            let newPower={


                id:Date.now()+index,


                documentation:
                row[0] || "",


                clientName:
                row[1] || "",


                powerNumber:
                row[2] || "",


                fileNumber:
                row[3] || getNextFileNumber()


            };



            powers.push(newPower);



            count++;



        });





        savePowers();



        currentData=[];


        displayPowers();



        alert(
            "تم استيراد " + count + " توكيل بنجاح"
        );



    };



    reader.readAsArrayBuffer(file);



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



    let start =
    (currentPage-1)*rowsPerPage;



    let data =
    currentData.slice(
        start,
        start+rowsPerPage
    );



    data.forEach(power=>{



        table.innerHTML += `

<tr>

<td>${power.documentation}</td>

<td>${power.clientName}</td>

<td>${power.powerNumber}</td>

<td>${power.fileNumber}</td>


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


        }else{


            currentData =
            powers.filter(p=>{


                return (

                String(p.fileNumber)
                .toLowerCase()
                .includes(value)


                ||

                String(p.powerNumber)
                .toLowerCase()
                .includes(value)


                ||

                String(p.clientName)
                .toLowerCase()
                .includes(value)


                ||

                String(p.documentation)
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
            p=>p.id!=id
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


    window.location.href=
    "powers-edit.html";


}









// =====================
// تنظيف
// =====================

function clearInputs(){


    document.getElementById("powerNumber").value="";


    document.getElementById("clientName").value="";


    document.getElementById("documentation").value="";


    document.getElementById("fileNumber").value=
    getNextFileNumber();


}









// =====================
// آخر رقم ملف
// =====================

function showLastFileNumber(){


    let last=2432;



    powers.forEach(p=>{


        let num=Number(p.fileNumber);



        if(!isNaN(num)&&num>last){


            last=num;

        }


    });



    alert(
        "آخر رقم ملف هو: "+last
    );


}









// =====================
// البيانات الناقصة
// =====================

function showEmptyPowers(){



    if(showingEmpty){


        currentData=[];


        showingEmpty=false;



    }else{


        currentData =
        powers.filter(p=>{


            return (

                !p.fileNumber ||

                !p.powerNumber ||

                !p.clientName ||

                !p.documentation

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
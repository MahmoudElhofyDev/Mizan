// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";




// =====================
// بيانات
// =====================

let cases = [];

let currentData = [];

let currentPage = 1;

let rowsPerPage = 50;

let searchTimer;





// =====================
// تحميل القضايا
// =====================

async function loadCases(){


    try{


        let res =
        await fetch(
            `${API}/cases`
        );


        cases =
        await res.json();


        currentData=[];


        displayCases();



    }

    catch(error){


        alert(
            "تعذر الاتصال بالسيرفر"
        );


    }



}








// =====================
// إضافة قضية
// =====================

async function addCase(){



let fileNumber =
document.getElementById("fileNumber").value.trim();



let clientName =
document.getElementById("clientName").value.trim();





if(clientName===""){


alert(
"ادخل اسم الموكل"
);


return;


}






await fetch(

`${API}/cases`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

fileNumber,

clientName

})


}

);





alert(
"تم إضافة القضية"
);



document.getElementById("fileNumber").value="";

document.getElementById("clientName").value="";



loadCases();



}









// =====================
// عرض البيانات
// =====================

function displayCases(){



let table =
document.getElementById(
"casesTable"
);



if(!table)
return;




table.innerHTML="";



let data =
currentData.length
?
currentData
:
cases;





let start =
(currentPage-1)
*
rowsPerPage;





data.slice(
start,
start+rowsPerPage
)

.forEach(item=>{


table.innerHTML += `


<tr>


<td>
${item.file_number || ""}
</td>



<td>
${item.client_name || ""}
</td>



<td>

<button onclick="editCase(${item.id})">

تعديل

</button>


</td>




<td>

<button onclick="deleteCase(${item.id})">

حذف

</button>


</td>



</tr>



`;



});



}









// =====================
// بحث
// =====================

function searchCases(){



let value =

document.getElementById(
"search"
)

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

String(item.file_number)

.includes(value)



||

String(item.client_name)

.toLowerCase()

.includes(value)



);


});



}



currentPage=1;


displayCases();



}








function delaySearch(){


clearTimeout(searchTimer);



searchTimer =
setTimeout(()=>{


searchCases();


},500);



}









// =====================
// حذف
// =====================

async function deleteCase(id){



if(!confirm(
"هل تريد حذف القضية؟"
))

return;





await fetch(

`${API}/cases/${id}`,

{

method:"DELETE"

}

);




loadCases();



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
// استيراد Excel
// =====================

async function importCasesExcel(){



let file =

document.getElementById(
"excelFile"
)

.files[0];





if(!file){


alert(
"اختر ملف Excel"
);


return;


}







let reader =
new FileReader();






reader.onload = async function(e){



let data =
new Uint8Array(
e.target.result
);



let workbook =
XLSX.read(

data,

{
type:"array"
}

);




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






let sendData=[];





rows.forEach(row=>{


if(row[0] && row[1]){


sendData.push({

fileNumber:String(row[0]),

clientName:String(row[1])

});


}


});







let res =
await fetch(

`${API}/cases/import`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

data:sendData

})


}

);





let result =
await res.json();





alert(

"تم استيراد "+
result.count+
" قضية"

);




loadCases();



};





reader.readAsArrayBuffer(file);



}









// =====================
// تشغيل
// =====================


if(
document.getElementById("casesTable")
){

loadCases();

}
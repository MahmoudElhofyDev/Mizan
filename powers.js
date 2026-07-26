// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// بيانات
// =====================

let powers = [];

let currentData = [];

let currentPage = 1;

let rowsPerPage = 50;

let searchTimer;






// =====================
// تحميل التوكيلات
// =====================

async function loadPowers(){


try{


let res =
await fetch(
`${API}/powers`
);



powers =
await res.json();



currentData=[];


displayPowers();



}


catch(error){


alert(
"تعذر الاتصال بالسيرفر"
);


}



}









// =====================
// إضافة توكيل
// =====================

async function addPower(){



let fileNumber =
document.getElementById(
"fileNumber"
).value.trim();



let powerNumber =
document.getElementById(
"powerNumber"
).value.trim();



let clientName =
document.getElementById(
"clientName"
).value.trim();



let documentation =
document.getElementById(
"documentation"
).value.trim();






if(clientName===""){


alert(
"ادخل اسم الموكل"
);


return;


}






await fetch(

`${API}/powers`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

fileNumber,

powerNumber,

clientName,

documentation

})


}

);





alert(
"تم إضافة التوكيل"
);




clearInputs();


loadPowers();



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



let data =
currentData.length
?
currentData
:
powers;





let start =
(currentPage-1)
*
rowsPerPage;





data.slice(

start,

start+rowsPerPage

)

.forEach(power=>{



table.innerHTML += `


<tr>


<td>

${power.file_number || ""}

</td>




<td>

${power.power_number || ""}

</td>




<td>

${power.client_name || ""}

</td>




<td>

${power.documentation || ""}

</td>




<td>

<button onclick="editPower(${power.id})">

تعديل

</button>


</td>




<td>

<button onclick="deletePower(${power.id})">

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

function searchPowers(){



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
powers.filter(item=>{


return (



String(item.file_number)

.includes(value)



||



String(item.power_number)

.includes(value)



||



String(item.client_name)

.toLowerCase()

.includes(value)



||



String(item.documentation)

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



searchTimer =

setTimeout(()=>{


searchPowers();


},500);



}









// =====================
// حذف
// =====================

async function deletePower(id){



if(!confirm(
"هل تريد حذف التوكيل؟"
))

return;






await fetch(

`${API}/powers/${id}`,

{

method:"DELETE"

}

);




loadPowers();



}









// =====================
// تعديل
// =====================

function editPower(id){



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



document.getElementById(
"fileNumber"
).value="";



document.getElementById(
"powerNumber"
).value="";



document.getElementById(
"clientName"
).value="";



document.getElementById(
"documentation"
).value="";



}









// =====================
// استيراد Excel
// =====================

async function importPowersExcel(){



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


powerNumber:String(row[1]),


clientName:String(row[2] || ""),


documentation:String(row[3] || "")



});


}



});







let res =

await fetch(

`${API}/powers/import`,

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

"تم استيراد "

+

result.count

+

" توكيل"

);






loadPowers();



};







reader.readAsArrayBuffer(file);



}









// =====================
// تشغيل
// =====================


if(

document.getElementById(
"powersTable"
)

){


loadPowers();


}
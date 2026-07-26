// =====================
// API Railway
// =====================

const API =
"https://mizan-production-32bb.up.railway.app";



// =====================
// متغيرات
// =====================

let powers = [];

let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let searchTimer;

let showingEmpty = false;



// =====================
// تحميل البيانات
// =====================

async function loadPowers(){

    try{


        let response =
        await fetch(
            `${API}/powers`
        );



        let data =
        await response.json();



        powers =
        data.map(item=>({


            id:item.id,


            fileNumber:
            item.file_number || "",


            powerNumber:
            item.power_number || "",


            clientName:
            item.client_name || "",


            documentation:
            item.documentation || "",


            type:
            item.type || "",


            birthDate:
            item.birth_date || ""


        }));




        currentData=[];

        currentPage=1;

        displayPowers();



    }

    catch(error){


        alert(
            "تعذر الاتصال بالسيرفر"
        );


    }


}







// =====================
// رقم الملف القادم
// =====================

function getNextFileNumber(){


    let last = 2432;



    powers.forEach(item=>{


        let num =
        Number(item.fileNumber);



        if(!isNaN(num) && num > last){

            last=num;

        }



    });



    return String(last+1);



}









// =====================
// إضافة توكيل
// =====================

async function addPower(){



let fileNumber =
document.getElementById("fileNumber").value.trim();



let powerNumber =
document.getElementById("powerNumber").value.trim();



let clientName =
document.getElementById("clientName").value.trim();



let documentation =
document.getElementById("documentation").value.trim();





if(fileNumber===""){

    fileNumber=getNextFileNumber();

}




if(clientName===""){


alert(
"أدخل اسم الموكل"
);


return;


}





try{


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
"تم إضافة التوكيل بنجاح"
);



clearInputs();


loadPowers();



}


catch(error){


alert(
"حدث خطأ أثناء الإضافة"
);


}



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
${power.fileNumber}
</td>


<td>
${power.powerNumber}
</td>


<td>
${power.clientName}
</td>


<td>
${power.documentation}
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





if(value===""){


currentData=[];


}

else{


currentData =
powers.filter(item=>{


return (

item.fileNumber
.toLowerCase()
.includes(value)



||

item.powerNumber
.toLowerCase()
.includes(value)



||

item.clientName
.toLowerCase()
.includes(value)



||

item.documentation
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
).value =
getNextFileNumber();



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
// آخر رقم ملف
// =====================

function showLastFileNumber(){



let last=2432;



powers.forEach(item=>{


let num =
Number(item.fileNumber);



if(!isNaN(num)&&num>last){

last=num;

}


});




alert(
"آخر رقم ملف هو: "+last
);



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



let pages =
Math.ceil(
powers.length / rowsPerPage
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
// تشغيل
// =====================

if(
document.getElementById("powersTable")
){


loadPowers();


}
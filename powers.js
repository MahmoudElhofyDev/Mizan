let powers =
JSON.parse(localStorage.getItem("powers")) || [];


let currentPage = 1;

let rowsPerPage = 50;

let currentData = powers;

let searchTimer;






// إضافة توكيل

function addPower(){


    let fileNumber =
    document.getElementById("fileNumber").value.trim();


    let powerNumber =
    document.getElementById("powerNumber").value.trim();


    let clientName =
    document.getElementById("clientName").value.trim();


    let documentation =
    document.getElementById("documentation").value.trim();





    if(
        fileNumber === "" ||
        powerNumber === "" ||
        clientName === ""
    ){

        alert("أدخل رقم الملف ورقم التوكيل واسم الموكل");

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



    clearInputs();



    currentData = powers;


    currentPage = 1;



    displayPowers();



}









// عرض التوكيلات

function displayPowers(){


    let table =
    document.getElementById("powersTable");



    if(!table)
    return;



    table.innerHTML = "";



    let start =
    (currentPage - 1) * rowsPerPage;



    let end =
    start + rowsPerPage;



    let data =
    currentData.slice(start,end);







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











// الصفحات

function createPagination(){


    let pagination =
    document.getElementById("pagination");



    if(!pagination)
    return;



    pagination.innerHTML = "";



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


    currentPage = page;


    displayPowers();


}









// البحث

function searchPowers(){


    let value =
    document.getElementById("search")
    .value
    .toLowerCase()
    .trim();




    if(value === ""){


        currentData = powers;


    }

    else{


        currentData =
        powers.filter(power=>{


            return (


                String(power.fileNumber || "")
                .toLowerCase()
                .includes(value)



                ||



                String(power.powerNumber || "")
                .toLowerCase()
                .includes(value)



                ||



                String(power.clientName || "")
                .toLowerCase()
                .includes(value)



                ||



                String(power.documentation || "")
                .toLowerCase()
                .includes(value)



            );


        });



    }




    currentPage = 1;



    displayPowers();



}









// بحث بدون تعليق

function delaySearch(){


    clearTimeout(searchTimer);



    searchTimer = setTimeout(()=>{


        searchPowers();



    },500);



}









// حذف

function deletePower(id){


    if(confirm("هل تريد حذف التوكيل؟")){


        powers =
        powers.filter(
            p=>p.id != id
        );



        localStorage.setItem(
            "powers",
            JSON.stringify(powers)
        );



        currentData = powers;



        displayPowers();



    }


}









// تعديل

function goEditPower(id){


    localStorage.setItem(
        "editPowerId",
        id
    );



    window.location.href =
    "powers-edit.html";


}









// تنظيف الخانات

function clearInputs(){


    document.getElementById("fileNumber").value = "";


    document.getElementById("powerNumber").value = "";


    document.getElementById("clientName").value = "";


    document.getElementById("documentation").value = "";


}









// تشغيل الصفحة

if(
document.getElementById("powersTable")
){


    currentData = powers;


    displayPowers();


}
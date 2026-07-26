const API =
"https://mizan-production-32bb.up.railway.app";



let powers = [];

let currentPage = 1;

let rowsPerPage = 50;

let currentData = [];

let searchTimer;






// =====================
// تحميل البيانات
// =====================

async function loadPowers(){


    try{


        let res =
        await fetch(`${API}/powers`);



        powers =
        await res.json();



        displayPowers();


    }
    catch(err){


        console.log(err);

        alert("تعذر تحميل البيانات");


    }


}









// =====================
// إضافة توكيل
// =====================

async function addPower(){



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






    if(
        clientName === ""
    ){

        alert("أدخل اسم الموكل");

        return;

    }






    await fetch(`${API}/powers`,{


        method:"POST",


        headers:{


            "Content-Type":"application/json"


        },


        body:JSON.stringify({


            documentation,

            clientName,

            powerNumber,

            fileNumber


        })


    });






    clearInputs();


    loadPowers();


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



    let rows =
    data.slice(
        start,
        start+rowsPerPage
    );






    rows.forEach(p=>{


        table.innerHTML += `


<tr>


<td>
${p.documentation || ""}
</td>


<td>
${p.clientName || ""}
</td>


<td>
${p.powerNumber || ""}
</td>


<td>
${p.fileNumber || ""}
</td>



<td>


<button onclick="editPower(${p.id})">

تعديل

</button>


</td>




<td>


<button onclick="deletePower(${p.id})">

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



    searchTimer =
    setTimeout(()=>{


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


                    String(p.documentation || "")
                    .toLowerCase()
                    .includes(value)



                    ||



                    String(p.clientName || "")
                    .toLowerCase()
                    .includes(value)



                    ||



                    String(p.powerNumber || "")
                    .toLowerCase()
                    .includes(value)



                    ||



                    String(p.fileNumber || "")
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

async function deletePower(id){



    if(confirm("هل تريد حذف التوكيل؟")){


        await fetch(

            `${API}/powers/${id}`,

            {

                method:"DELETE"

            }

        );



        loadPowers();


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



    window.location.href =
    "powers-edit.html";


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





    alert(
        "آخر رقم ملف هو: "+max
    );



}









// =====================
// تنظيف
// =====================

function clearInputs(){



    document.getElementById("documentation").value="";


    document.getElementById("clientName").value="";


    document.getElementById("powerNumber").value="";


    document.getElementById("fileNumber").value="";


}









// =====================
// الصفحات
// =====================

function createPagination(){


    let box =
    document.getElementById("pagination");



    if(!box)
    return;



    box.innerHTML="";



    let data =
    currentData.length ?
    currentData :
    powers;



    let pages =
    Math.ceil(
        data.length / rowsPerPage
    );



    for(let i=1;i<=pages;i++){


        box.innerHTML += `

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









// تشغيل

loadPowers();
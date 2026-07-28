// =====================================
// MIZAN - CASES.JS
// PostgreSQL Railway Version
// =====================================


// ===============================
// API
// ===============================

const API =
"https://mizan-production-32bb.up.railway.app";



// ===============================
// Variables
// ===============================

let allCases = [];

let filteredCases = [];

let currentPage = 1;

const rowsPerPage = 50;

let currentEditId = null;



// ===============================
// تشغيل الصفحة
// ===============================

window.onload = async function(){


    hideTable();


    bindEvents();


    await loadAllCases();


};




// ===============================
// الأحداث
// ===============================

function bindEvents(){


    const search =
    document.getElementById(
        "searchInput"
    );


    if(search){

        search.addEventListener(
            "input",
            searchCases
        );

    }



    const lastBtn =
    document.getElementById(
        "lastFileBtn"
    );


    if(lastBtn){

        lastBtn.onclick =
        showLastFileNumber;

    }



    const excel =
    document.getElementById(
        "excelInput"
    );


    if(excel){

        excel.addEventListener(
            "change",
            importExcelCases
        );

    }


}




// ===============================
// تحميل البيانات
// ===============================
// =====================================
// تحميل البيانات
// =====================================

async function loadAllCases(){

    try{

        const response =
        await fetch(
            API + "/cases"
        );


        if(!response.ok){

            throw new Error(
                "API ERROR " + response.status
            );

        }



        const data =
        await response.json();



        if(Array.isArray(data)){


            allCases = data;



            console.log(

                "Cases Loaded:",

                allCases.length

            );


        }

        else{


            console.log(

                "Invalid API Response:",

                data

            );


            allCases = [];


        }



    }

    catch(err){


        console.log(

            "LOAD CASES ERROR:",

            err

        );


        allCases = [];


    }


}




// ===============================
// البحث
// ===============================
function searchCases(){


    const input =
    document.getElementById(
        "searchInput"
    );


    if(!input)
        return;



    if(!Array.isArray(allCases)){

        allCases = [];

    }



    const keyword =
    input.value
    .trim()
    .toLowerCase();



    if(keyword === ""){


        clearSearch();

        return;


    }





    filteredCases =

    allCases.filter(c=>{


        return (

            String(
                c.file_number || ""
            )
            .toLowerCase()
            .includes(keyword)



            ||



            String(
                c.client_name || ""
            )
            .toLowerCase()
            .includes(keyword)



            ||



            String(
                c.court || ""
            )
            .toLowerCase()
            .includes(keyword)



        );


    });






    currentPage = 1;



    showTable();



    renderCases();



}

    if(!Array.isArray(allPowers)){

        allPowers = [];

    }



// ===============================
// إخفاء الجدول
// ===============================

function hideTable(){


    const table =
    document.getElementById(
        "casesTable"
    );


    const empty =
    document.getElementById(
        "emptyMessage"
    );



    if(table)

        table.style.display =
        "none";



    if(empty)

        empty.style.display =
        "block";



}




// ===============================
// إظهار الجدول
// ===============================

function showTable(){


    const table =
    document.getElementById(
        "casesTable"
    );



    const empty =
    document.getElementById(
        "emptyMessage"
    );



    if(table)

        table.style.display =
        "table";



    if(empty)

        empty.style.display =
        "none";



}




// ===============================
// عرض البيانات
// ===============================

function renderCases(){



    const body =
    document.getElementById(
        "casesBody"
    );



    if(!body)
        return;




    body.innerHTML = "";





    if(filteredCases.length === 0){


        body.innerHTML = `

        <tr>

        <td colspan="4">

        لا توجد نتائج

        </td>

        </tr>

        `;


        return;


    }





    const start =
    (currentPage - 1)
    *
    rowsPerPage;




    const data =
    filteredCases.slice(

        start,

        start + rowsPerPage

    );





    data.forEach(c=>{


        body.innerHTML += `


<tr>


<td>

${c.file_number || ""}

</td>



<td>

${c.client_name || ""}

</td>



<td>

<button

class="edit"

onclick="openEditModal(${c.id})"

>

تعديل

</button>


</td>



<td>

<button

class="delete"

onclick="deleteCase(${c.id})"

>

حذف

</button>


</td>



</tr>


`;



    });




    renderPagination();



}

// ===============================
// Pagination
// ===============================

function renderPagination(){


    const pagination =
    document.getElementById(
        "pagination"
    );


    if(!pagination)
        return;



    pagination.innerHTML = "";



    const totalPages =
    Math.ceil(
        filteredCases.length /
        rowsPerPage
    );



    if(totalPages <= 1)
        return;




    const prev =
    document.createElement(
        "button"
    );


    prev.innerHTML = "◀";


    prev.disabled =
    currentPage === 1;



    prev.onclick = ()=>{


        if(currentPage > 1){


            currentPage--;

            renderCases();


        }


    };


    pagination.appendChild(prev);





    for(
        let i = 1;
        i <= totalPages;
        i++
    ){


        const btn =
        document.createElement(
            "button"
        );



        btn.innerText = i;



        if(i === currentPage)

            btn.className =
            "active";




        btn.onclick = ()=>{


            currentPage = i;


            renderCases();


        };



        pagination.appendChild(btn);



    }





    const next =
    document.createElement(
        "button"
    );



    next.innerHTML = "▶";



    next.disabled =
    currentPage === totalPages;




    next.onclick = ()=>{


        if(currentPage < totalPages){


            currentPage++;


            renderCases();


        }


    };



    pagination.appendChild(next);



}




// ===============================
// مسح البحث
// ===============================

function clearSearch(){



    const input =
    document.getElementById(
        "searchInput"
    );



    if(input)

        input.value="";



    filteredCases=[];


    currentPage=1;




    const pagination =
    document.getElementById(
        "pagination"
    );



    if(pagination)

        pagination.innerHTML="";




    hideTable();



}




// ===============================
// فتح إضافة ملف
// ===============================

function openAddModal(){



    document
    .getElementById(
        "addModal"
    )
    .style.display="flex";


}




function closeAddModal(){


    document
    .getElementById(
        "addModal"
    )
    .style.display="none";


}





// ===============================
// إضافة ملف
// ===============================

async function saveCase(){



    const file_number =

    document
    .getElementById(
        "fileNumber"
    )
    .value
    .trim();





    const client_name =

    document
    .getElementById(
        "clientName"
    )
    .value
    .trim();





    if(
        !file_number ||
        !client_name
    ){


        alert(
            "برجاء إدخال البيانات المطلوبة"
        );


        return;


    }





    const exists =

    allCases.find(c=>

        String(
            c.file_number
        )
        ===
        String(
            file_number
        )

    );





    if(exists){


        alert(
            "رقم الملف موجود بالفعل"
        );


        return;


    }





    try{


        const response =

        await fetch(

            API + "/cases",

            {

            method:"POST",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                file_number,

                client_name


            })


            }

        );





        const data =

        await response.json();





        console.log(
            "ADD CASE:",
            data
        );





        if(data.success){



            showToast(
                "تمت إضافة الملف"
            );



            closeAddModal();



            await loadAllCases();



            clearSearch();



        }

        else{


            alert(
                data.message ||
                "فشل الإضافة"
            );


        }



    }

    catch(error){


        console.log(error);


        alert(
            "خطأ في الاتصال بالسيرفر"
        );


    }



}






// ===============================
// فتح تعديل
// ===============================

function openEditModal(id){



    const item =

    allCases.find(

        c => c.id == id

    );





    if(!item)

        return;





    currentEditId=id;





    document
    .getElementById(
        "editFileNumber"
    )
    .value =
    item.file_number || "";




    document
    .getElementById(
        "editClientName"
    )
    .value =
    item.client_name || "";





    document
    .getElementById(
        "editModal"
    )
    .style.display="flex";



}





function closeEditModal(){


    document
    .getElementById(
        "editModal"
    )
    .style.display="none";


}





// ===============================
// حفظ التعديل
// ===============================

async function updateCase(){



    const file_number =

    document
    .getElementById(
        "editFileNumber"
    )
    .value
    .trim();





    const client_name =

    document
    .getElementById(
        "editClientName"
    )
    .value
    .trim();





    try{



        const response =

        await fetch(

            API +
            "/cases/" +
            currentEditId,

            {

            method:"PUT",


            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                file_number,

                client_name


            })


            }

        );






        const data =

        await response.json();





        if(data.success){



            showToast(
                "تم تعديل الملف"
            );


            closeEditModal();



            await loadAllCases();



            searchCases();



        }

        else{


            alert(
                data.message ||
                "فشل التعديل"
            );


        }



    }

    catch(error){


        console.log(error);


        alert(
            "حدث خطأ أثناء التعديل"
        );


    }



}




// ===============================
// حذف ملف
// ===============================

async function deleteCase(id){



    if(
        !confirm(
            "هل تريد حذف الملف؟"
        )
    )

    return;





    try{


        const response =

        await fetch(

            API +
            "/cases/" +
            id,

            {

            method:"DELETE"

            }

        );





        const data =

        await response.json();





        if(data.success){


            showToast(
                "تم حذف الملف"
            );


            await loadAllCases();


            searchCases();


        }




    }

    catch(error){


        console.log(error);


        alert(
            "حدث خطأ أثناء الحذف"
        );


    }



}

// ===============================
// آخر رقم ملف
// ===============================

async function showLastFileNumber(){


    try{


        const response =

        await fetch(

            API +
            "/cases/last-file"

        );



        const data =

        await response.json();




        document
        .getElementById(
            "lastFileValue"
        )
        .innerText =

        data.lastFile || 0;





        document
        .getElementById(
            "lastFileModal"
        )
        .style.display =
        "flex";



    }

    catch(error){


        console.log(error);


        alert(
            "تعذر جلب آخر رقم ملف"
        );


    }


}




function closeLastFileModal(){


    const modal =

    document.getElementById(
        "lastFileModal"
    );



    if(modal)

        modal.style.display="none";


}





// ===============================
// استيراد Excel
// قراءة تلقائية
// ===============================

async function importExcelCases(event){



    const file =

    event.target.files[0];



    if(!file)

        return;





    const reader =

    new FileReader();





    reader.onload = async function(e){


        try{


            const data =

            new Uint8Array(

                e.target.result

            );





            const workbook =

            XLSX.read(

                data,

                {

                    type:"array"

                }

            );






            const sheet =

            workbook.Sheets[

                workbook.SheetNames[0]

            ];







            let rows =

            XLSX.utils.sheet_to_json(

                sheet,

                {

                    header:1,

                    defval:""

                }

            );






            console.log(
                "EXCEL RAW:",
                rows
            );






            if(!rows || rows.length < 2){


                alert(
                    "ملف Excel فارغ"
                );


                return;


            }






            // إزالة صف العناوين

            rows.shift();








            let excelData = [];







            rows.forEach(row=>{


                if(
                    row[0] &&
                    row[1]
                ){


                    excelData.push({

                        file_number:

                        String(row[0]),



                        client_name:

                        String(row[1])

                    });



                }



            });






            console.log(

                "SEND EXCEL:",

                excelData

            );








            if(excelData.length===0){


                alert(

                    "لم يتم العثور على بيانات"

                );


                return;


            }








            const response =

            await fetch(

                API +

                "/cases/import",

                {


                method:"POST",



                headers:{


                    "Content-Type":

                    "application/json"


                },



                body:JSON.stringify({


                    data:excelData


                })


                }

            );








            const result =

            await response.json();






            console.log(

                "IMPORT RESULT:",

                result

            );







            if(result.success){



                alert(

                "تم الاستيراد بنجاح\n\n" +

                "المضاف : " +

                (result.added || 0) +

                "\nالمكرر : " +

                (result.duplicate || 0) +

                "\nالأخطاء : " +

                (result.failed || 0)

                );





                await loadAllCases();



                clearSearch();



            }

            else{


                alert(

                    result.message ||

                    "فشل الاستيراد"

                );


            }







        }

        catch(error){


            console.log(

                "EXCEL ERROR:",

                error

            );



            alert(

                "حدث خطأ أثناء قراءة الملف"

            );


        }



    };






    reader.readAsArrayBuffer(file);



}






// ===============================
// Toast
// ===============================

function showToast(message){



    const toast =

    document.getElementById(
        "toast"
    );



    if(!toast)

        return;





    toast.innerText =
    message;




    toast.style.display =
    "block";






    setTimeout(()=>{


        toast.style.display =
        "none";



    },2000);



}






// ===============================
// إغلاق النوافذ بالضغط خارجها
// ===============================

window.onclick=function(event){



    const add =

    document.getElementById(
        "addModal"
    );



    const edit =

    document.getElementById(
        "editModal"
    );



    const last =

    document.getElementById(
        "lastFileModal"
    );





    if(event.target === add){


        closeAddModal();


    }




    if(event.target === edit){


        closeEditModal();


    }




    if(event.target === last){


        closeLastFileModal();


    }



};






// ===============================
// تحديث البيانات
// ===============================

async function refreshCases(){


    await loadAllCases();


    searchCases();


}

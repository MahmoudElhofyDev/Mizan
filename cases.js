// =====================================
// MIZAN - CASES.JS
// Railway API Version
// =====================================


// API

const API =
"https://mizan-production-32bb.up.railway.app";



// المتغيرات

let allCases = [];

let filteredCases = [];

let currentPage = 1;

const rowsPerPage = 50;

let currentEditId = null;



// =====================================
// تشغيل الصفحة
// =====================================

window.onload = async function(){


    hideTable();


    bindEvents();


    await loadAllCases();


};




// =====================================
// الأحداث
// =====================================

function bindEvents(){


    const search =
    document.getElementById(
        "searchInput"
    );


    if(search){

        search.addEventListener(
            "keyup",
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




// =====================================
// تحميل البيانات
// =====================================

async function loadAllCases(){


    try{


        const response =
        await fetch(
            API + "/cases"
        );


        const data =
        await response.json();



        if(Array.isArray(data)){

            allCases = data;

        }

        else{

            allCases = [];

        }



    }

    catch(err){


        console.log(err);

        allCases = [];

    }


}




// =====================================
// البحث
// =====================================

function searchCases(){


    const input =
    document.getElementById(
        "searchInput"
    );


    if(!input)
        return;



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


        );


    });





    currentPage = 1;


    showTable();


    renderCases();



}




// =====================================
// إخفاء الجدول
// =====================================

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




// =====================================
// إظهار الجدول
// =====================================

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



// =====================================
// عرض البيانات
// =====================================

function renderCases(){


    const body =
    document.getElementById(
        "casesBody"
    );


    if(!body)
        return;



    body.innerHTML = "";



    if(filteredCases.length === 0){


        hideTable();

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
${c.file_number}
</td>


<td>
${c.client_name}
</td>


<td>

<button
class="edit"
onclick="openEditModal(${c.id})">

تعديل

</button>


</td>


<td>

<button
class="delete"
onclick="deleteCase(${c.id})">

حذف

</button>


</td>


</tr>


`;



    });



    renderPagination();


}

// =====================================
// Pagination
// =====================================

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


    prev.innerText = "❮";


    prev.disabled =
    currentPage === 1;


    prev.onclick = ()=>{


        currentPage--;

        renderCases();

    };


    pagination.appendChild(prev);




    for(let i=1;i<=totalPages;i++){


        const btn =
        document.createElement(
            "button"
        );


        btn.innerText = i;



        if(i === currentPage){

            btn.className =
            "active";

        }



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


    next.innerText = "❯";


    next.disabled =
    currentPage === totalPages;



    next.onclick = ()=>{


        currentPage++;

        renderCases();


    };


    pagination.appendChild(next);



}




// =====================================
// مسح البحث
// =====================================

function clearSearch(){


    const input =
    document.getElementById(
        "searchInput"
    );


    if(input)

        input.value = "";



    filteredCases = [];

    currentPage = 1;



    const pagination =
    document.getElementById(
        "pagination"
    );


    if(pagination)

        pagination.innerHTML = "";



    hideTable();


}




// =====================================
// فتح إضافة ملف
// =====================================

function openAddModal(){


    document
    .getElementById(
        "addModal"
    )
    .style.display =
    "flex";


}




function closeAddModal(){


    document
    .getElementById(
        "addModal"
    )
    .style.display =
    "none";


}




// =====================================
// إضافة ملف
// =====================================

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




    if(!file_number || !client_name){


        alert(
            "برجاء إدخال البيانات"
        );


        return;

    }




    const exist =
    allCases.find(c=>

        String(c.file_number)
        ===
        String(file_number)

    );



    if(exist){


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




        if(data.success){


            showToast(
                "تمت إضافة الملف"
            );


            closeAddModal();


            document
            .getElementById(
                "fileNumber"
            )
            .value = "";



            document
            .getElementById(
                "clientName"
            )
            .value = "";



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

    catch(err){


        console.log(err);


        alert(
            "خطأ في الاتصال بالسيرفر"
        );


    }



}







// =====================================
// تعديل ملف
// =====================================

function openEditModal(id){


    const item =
    allCases.find(
        c=>c.id == id
    );



    if(!item)
        return;



    currentEditId = id;



    document
    .getElementById(
        "editFileNumber"
    )
    .value =
    item.file_number;



    document
    .getElementById(
        "editClientName"
    )
    .value =
    item.client_name;




    document
    .getElementById(
        "editModal"
    )
    .style.display =
    "flex";



}




function closeEditModal(){


    document
    .getElementById(
        "editModal"
    )
    .style.display =
    "none";


}






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




    if(!file_number || !client_name){


        alert(
            "برجاء إدخال البيانات"
        );


        return;

    }




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




// =====================================
// حذف ملف
// =====================================

// =====================================
// استيراد Excel - قراءة تلقائية
// =====================================

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
                "Excel Rows:",
                rows
            );



            if(!rows || rows.length < 2){


                alert(
                    "ملف Excel فارغ"
                );


                return;

            }




            // حذف عنوان الأعمدة

            rows.shift();





            rows =
            rows

            .filter(row=>{


                return row.length > 0;


            })

            .map(row=>{


                return {


                    file_number:

                    String(
                        row[0] || ""
                    ),



                    client_name:

                    String(
                        row[1] || ""
                    )


                };


            });






            console.log(
                "Sending Data:",
                rows
            );







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


                body:

                JSON.stringify({

                    data:rows

                })


                }

            );







            const result =
            await response.json();







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

        catch(err){


            console.log(
                "IMPORT ERROR:",
                err
            );


            alert(
                "حدث خطأ أثناء قراءة الملف"
            );


        }



    };



    reader.readAsArrayBuffer(file);



}




// =====================================
// Toast
// =====================================

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








// =====================================
// إغلاق Modal عند الضغط خارجها
// =====================================

window.onclick = function(event){



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

// =====================================
// MIZAN - POWERS.JS
// Railway PostgreSQL Version
// =====================================


// =====================================
// API
// =====================================

const API =
"https://mizan-production-32bb.up.railway.app";




// =====================================
// المتغيرات
// =====================================

let allPowers = [];

let filteredPowers = [];

let currentPage = 1;

const rowsPerPage = 50;

let currentEditId = null;





// =====================================
// تشغيل الصفحة
// =====================================

window.onload = async ()=>{

    hideTable();

    document
    .getElementById("lastPowerBtn")
    .onclick = getLastPower;

    await loadAllPowers();

};






// =====================================
// الأحداث
// =====================================

function bindEvents(){



    const lastBtn =

    document.getElementById(
        "lastPowerBtn"
    );



    if(lastBtn){


        lastBtn.onclick =
        getLastPower;


    }






    const excelInput =

    document.getElementById(
        "excelInput"
    );



    if(excelInput){


        excelInput.addEventListener(

            "change",

            importExcelPowers

        );


    }



}







// =====================================
// تحميل البيانات
// =====================================

async function loadAllPowers(){


    try{


        const response =

        await fetch(

            API +

            "/powers"

        );

const data =
await response.json();


if(Array.isArray(data)){

    allPowers = data;

}

else{

    allPowers = [];

}


            console.log(

                "Unexpected API response:",

                data

            );


        }



    


    catch(err){


        console.log(err);


        allPowers = [];


    }



}







// =====================================
// إخفاء الجدول
// =====================================

function hideTable(){


    const table =

    document.getElementById(
        "powersTable"
    );



    const empty =

    document.getElementById(
        "emptyMessage"
    );



    if(table)

        table.style.display="none";



    if(empty)

        empty.style.display="block";



}







// =====================================
// إظهار الجدول
// =====================================

function showTable(){



    const table =

    document.getElementById(
        "powersTable"
    );



    const empty =

    document.getElementById(
        "emptyMessage"
    );



    if(table)

        table.style.display="table";



    if(empty)

        empty.style.display="none";



}


// =====================================
// البحث
// =====================================

function searchPowers(){


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





    if(keyword===""){


        clearSearch();

        return;


    }







    filteredPowers =

    allPowers.filter(p=>{


        return(



            String(

                p.power_number || ""

            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(

                p.client_name || ""

            )

            .toLowerCase()

            .includes(keyword)





            ||





            String(

                p.documentation || ""

            )

            .toLowerCase()

            .includes(keyword)





        );


    });






    currentPage = 1;



    showTable();


    renderPowers();



}









// =====================================
// عرض البيانات
// =====================================

function renderPowers(){



    const body =

    document.getElementById(
        "powersBody"
    );



    if(!body)

        return;





    body.innerHTML="";







    if(filteredPowers.length===0){



        body.innerHTML=`

<tr>

<td colspan="5">

لا توجد نتائج

</td>

</tr>

`;



        document

        .getElementById(
            "pagination"
        )

        .innerHTML="";



        return;


    }








    const start =

    (currentPage - 1)

    *

    rowsPerPage;







    const data =

    filteredPowers.slice(

        start,

        start + rowsPerPage

    );








    data.forEach(power=>{



        body.innerHTML += `



<tr>



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


<button

class="edit"

onclick="openEditModal(${power.id})">

تعديل

</button>



</td>







<td>


<button

class="delete"

onclick="deletePower(${power.id})">

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





    pagination.innerHTML="";







    const totalPages =

    Math.ceil(

        filteredPowers.length /

        rowsPerPage

    );







    if(totalPages <= 1)

        return;









    const prev =

    document.createElement(
        "button"
    );



    prev.innerHTML="◀";



    prev.disabled =

    currentPage===1;





    prev.onclick=()=>{


        if(currentPage>1){


            currentPage--;

            renderPowers();


        }


    };



    pagination.appendChild(prev);









    for(

        let i=1;

        i<=totalPages;

        i++

    ){



        const btn =

        document.createElement(
            "button"
        );



        btn.innerText=i;



        if(i===currentPage)

            btn.className="active";





        btn.onclick=()=>{


            currentPage=i;


            renderPowers();


        };



        pagination.appendChild(btn);



    }









    const next =

    document.createElement(
        "button"
    );



    next.innerHTML="▶";



    next.disabled =

    currentPage===totalPages;





    next.onclick=()=>{


        if(currentPage < totalPages){


            currentPage++;


            renderPowers();


        }


    };



    pagination.appendChild(next);



}









// =====================================
// إعادة البحث
// =====================================

function clearSearch(){



    const input =

    document.getElementById(
        "searchInput"
    );



    if(input)

        input.value="";





    filteredPowers=[];


    currentPage=1;





    const pagination =

    document.getElementById(
        "pagination"
    );



    if(pagination)

        pagination.innerHTML="";





    hideTable();



}


// =====================================
// إضافة توكيل
// =====================================

async function savePower(){



    const power_number =

    document

    .getElementById("powerNumber")

    .value

    .trim();





    const client_name =

    document

    .getElementById("clientName")

    .value

    .trim();





    const documentation =

    document

    .getElementById("documentation")

    .value

    .trim();







    if(

        power_number === "" ||

        client_name === ""

    ){


        alert(

            "برجاء إدخال البيانات المطلوبة"

        );


        return;


    }







    const exists =

    allPowers.find(p =>


        String(

            p.power_number

        ) === String(power_number)



    );







    if(exists){



        alert(

            "رقم التوكيل موجود بالفعل"

        );


        return;


    }









    try{



        const response =

        await fetch(

            API +

            "/powers",

            {


                method:"POST",



                headers:{


                    "Content-Type":

                    "application/json"


                },



                body:JSON.stringify({



                    power_number,

                    client_name,

                    documentation



                })


            }

        );








        const result =

        await response.json();









        if(result.success){



            showToast(

                "تمت إضافة التوكيل"

            );



            closeAddModal();



            await loadAllPowers();



            clearSearch();



        }

        else{


            alert(

                result.message ||

                "فشل الإضافة"

            );


        }







    }

    catch(err){



        console.log(err);



        alert(

            "تعذر الاتصال بالسيرفر"

        );


    }



}









// =====================================
// فتح التعديل
// =====================================

function openEditModal(id){



    currentEditId=id;






    const power =

    allPowers.find(

        p => p.id == id

    );






    if(!power)

        return;







    document

    .getElementById("editPowerNumber")

    .value =

    power.power_number;







    document

    .getElementById("editClientName")

    .value =

    power.client_name;








    document

    .getElementById("editDocumentation")

    .value =

    power.documentation || "";








    document

    .getElementById("editModal")

    .style.display="flex";



}









// =====================================
// حفظ التعديل
// =====================================

async function updatePower(){



    const power_number =

    document

    .getElementById("editPowerNumber")

    .value

    .trim();






    const client_name =

    document

    .getElementById("editClientName")

    .value

    .trim();






    const documentation =

    document

    .getElementById("editDocumentation")

    .value

    .trim();









    const duplicate =

    allPowers.find(p =>



        String(p.power_number)

        ===

        String(power_number)



        &&



        p.id != currentEditId



    );







    if(duplicate){



        alert(

            "رقم التوكيل موجود بالفعل"

        );


        return;


    }









    try{



        const response =

        await fetch(

            API +

            "/powers/" +

            currentEditId,

            {


                method:"PUT",



                headers:{


                    "Content-Type":

                    "application/json"


                },



                body:JSON.stringify({


                    power_number,

                    client_name,

                    documentation


                })


            }

        );








        const result =

        await response.json();








        if(result.success){



            showToast(

                "تم تعديل التوكيل"

            );



            closeEditModal();



            await loadAllPowers();



            searchPowers();



        }

        else{


            alert(

                result.message ||

                "فشل التعديل"

            );


        }







    }

    catch(err){



        console.log(err);



        alert(

            "حدث خطأ أثناء التعديل"

        );


    }



}









// =====================================
// حذف توكيل
// =====================================

async function deletePower(id){



    if(

        !confirm(

            "هل تريد حذف التوكيل؟"

        )

    ){


        return;


    }








    try{



        const response =

        await fetch(

            API +

            "/powers/" +

            id,

            {


                method:"DELETE"


            }

        );








        const result =

        await response.json();








        if(result.success){



            showToast(

                "تم حذف التوكيل"

            );



            await loadAllPowers();



            searchPowers();



        }

        else{


            alert(

                result.message ||

                "فشل الحذف"

            );


        }







    }

    catch(err){



        console.log(err);



        alert(

            "تعذر الاتصال بالسيرفر"

        );


    }



}


// =====================================
// آخر رقم توكيل
// =====================================

async function getLastPower(){


    try{


        const response =

        await fetch(

            API +

            "/powers/last-number"

        );



        const data =

        await response.json();




        document

        .getElementById("lastPowerValue")

        .innerText =

        data.lastPower || 0;




        document

        .getElementById("lastPowerModal")

        .style.display="flex";



    }

    catch(err){


        console.log(err);


        alert(

            "تعذر جلب آخر رقم توكيل"

        );


    }


}









// =====================================
// فتح نافذة الإضافة
// =====================================

function openAddModal(){



    document

    .getElementById("powerNumber")

    .value="";



    document

    .getElementById("clientName")

    .value="";



    document

    .getElementById("documentation")

    .value="";





    document

    .getElementById("addModal")

    .style.display="flex";


}









// =====================================
// غلق النوافذ
// =====================================

function closeAddModal(){


    document

    .getElementById("addModal")

    .style.display="none";


}





function closeEditModal(){


    document

    .getElementById("editModal")

    .style.display="none";


}





function closeLastPowerModal(){


    document

    .getElementById("lastPowerModal")

    .style.display="none";


}









// =====================================
// استيراد Excel
// =====================================

async function importExcelPowers(event){


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
                    defval:""
                }
            );





            if(rows.length === 0){


                alert(
                    "ملف Excel فارغ"
                );


                return;

            }






            // تحويل أعمدة Excel العربية

            rows =
            rows.map(row=>{


                return {


                    documentation:

                    String(

                        row["جهة الإصدار"] ||

                        row["جهة الاصدار"] ||

                        row.documentation ||

                        ""

                    ),




                    power_number:

                    String(

                        row["رقم التوكيل"] ||

                        row["رقم التوكيل "] ||

                        row.power_number ||

                        ""

                    ),





                    client_name:

                    String(

                        row["اسم الموكل"] ||

                        row["اسم العميل"] ||

                        row.client_name ||

                        ""

                    ),





                    file_number:

                    String(

                        row["رقم الملف"] ||

                        row["رقم ملف"] ||

                        row.file_number ||

                        ""

                    )



                };


            });








            const response =
            await fetch(

                API +
                "/powers/import",

                {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },


                body:JSON.stringify({

                    data:rows

                })


                }

            );







            const result =
            await response.json();






            if(result.success){



                alert(

                "تم استيراد التوكيلات بنجاح\n\n" +

                "المضاف : " +
                result.added +

                "\nالمكرر : " +
                result.duplicate +

                "\nالأخطاء : " +
                result.failed

                );



                await loadAllPowers();


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


            console.log(err);


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

    document.getElementById("toast");



    if(!toast)

        return;





    toast.innerText = message;



    toast.style.display="block";







    setTimeout(()=>{


        toast.style.display="none";


    },2000);



}









// =====================================
// إغلاق عند الضغط خارج النافذة
// =====================================

window.onclick=function(event){



    if(

        event.target ===

        document.getElementById("addModal")

    ){

        closeAddModal();

    }





    if(

        event.target ===

        document.getElementById("editModal")

    ){

        closeEditModal();

    }





    if(

        event.target ===

        document.getElementById("lastPowerModal")

    ){

        closeLastPowerModal();

    }



};









// =====================================
// تحديث البيانات
// =====================================

async function refreshPowers(){


    await loadAllPowers();


    searchPowers();


}

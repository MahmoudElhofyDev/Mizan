// =====================================
// الإعدادات
// =====================================

const API =
"https://mizan-production-32bb.up.railway.app";

let allPowers = [];

let filteredPowers = [];

let currentPage = 1;

const rowsPerPage = 50;

let currentEditId = null;



// =====================================
// تحميل الصفحة
// =====================================

window.onload = async ()=>{

    hideTable();

    await loadAllPowers();

};



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

        allPowers =
        await response.json();

    }

    catch(err){

        console.log(err);

    }

}



// =====================================
// البحث
// =====================================

function searchPowers(){

    const keyword =

    document
    .getElementById("searchInput")
    .value
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

                p.power_number

            )

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
// إخفاء الجدول
// =====================================

function hideTable(){

    document
    .getElementById("powersTable")
    .style.display =
    "none";

    document
    .getElementById("emptyMessage")
    .style.display =
    "block";

}



// =====================================
// إظهار الجدول
// =====================================

function showTable(){

    document
    .getElementById("powersTable")
    .style.display =
    "table";

    document
    .getElementById("emptyMessage")
    .style.display =
    "none";

}

// =====================================
// عرض البيانات
// =====================================

function renderPowers(){

    const body =
    document.getElementById("powersBody");

    body.innerHTML = "";

    if(filteredPowers.length === 0){

        hideTable();

        return;

    }

    const start =
    (currentPage - 1) * rowsPerPage;

    const end =
    start + rowsPerPage;

    const pageData =
    filteredPowers.slice(start, end);

    pageData.forEach(power=>{

        body.innerHTML += `

<tr>

<td>${power.power_number}</td>

<td>${power.client_name}</td>

<td>${power.documentation || ""}</td>

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
    document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages =

    Math.ceil(

        filteredPowers.length /

        rowsPerPage

    );

    if(totalPages <= 1){

        return;

    }

    const prev = document.createElement("button");

    prev.innerHTML = "❮";

    prev.disabled =

    currentPage === 1;

    prev.onclick = ()=>{

        currentPage--;

        renderPowers();

    };

    pagination.appendChild(prev);



    for(

        let i = 1;

        i <= totalPages;

        i++

    ){

        const btn =

        document.createElement("button");

        btn.innerText = i;

        if(i===currentPage){

            btn.className="active";

        }

        btn.onclick = ()=>{

            currentPage = i;

            renderPowers();

        };

        pagination.appendChild(btn);

    }



    const next =

    document.createElement("button");

    next.innerHTML = "❯";

    next.disabled =

    currentPage === totalPages;

    next.onclick = ()=>{

        currentPage++;

        renderPowers();

    };

    pagination.appendChild(next);

}



// =====================================
// إعادة البحث
// =====================================

function clearSearch(){

    document
    .getElementById("searchInput")
    .value = "";

    filteredPowers = [];

    currentPage = 1;

    document
    .getElementById("pagination")
    .innerHTML = "";

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

        power_number==="" ||

        client_name===""

    ){

        alert("برجاء إدخال جميع البيانات");

        return;

    }



    const exist =

    allPowers.find(

        p =>

        String(

            p.power_number

        ) ===

        power_number

    );



    if(exist){

        alert(

            "رقم التوكيل موجود بالفعل"

        );

        return;

    }



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

        closeAddModal();

        showToast(

            "تمت إضافة التوكيل"

        );

        await loadAllPowers();

        clearSearch();

    }

}



// =====================================
// فتح نافذة التعديل
// =====================================

function openEditModal(id){

    currentEditId = id;

    const p =

    allPowers.find(

        x => x.id == id

    );

    if(!p){

        return;

    }

    document
    .getElementById("editPowerNumber")
    .value =
    p.power_number;

    document
    .getElementById("editClientName")
    .value =
    p.client_name;

    document
    .getElementById("editDocumentation")
    .value =
    p.documentation || "";

    document
    .getElementById("editModal")
    .style.display =
    "flex";

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

        closeEditModal();

        showToast(

            "تم حفظ التعديل"

        );

        await loadAllPowers();

        searchPowers();

    }

}



// =====================================
// حذف
// =====================================

async function deletePower(id){

    if(

        !confirm(

            "هل تريد حذف التوكيل؟"

        )

    ){

        return;

    }



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

}



// =====================================
// آخر رقم توكيل
// =====================================

async function getLastPower(){

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

    data.lastPower ||

    "لا يوجد";



    document
    .getElementById("lastPowerModal")
    .style.display =

    "flex";

}

// =====================================
// فتح نافذة الإضافة
// =====================================

function openAddModal(){

    document
    .getElementById("powerNumber")
    .value = "";

    document
    .getElementById("clientName")
    .value = "";

    document
    .getElementById("documentation")
    .value = "";

    document
    .getElementById("addModal")
    .style.display = "flex";

}



// =====================================
// غلق نافذة الإضافة
// =====================================

function closeAddModal(){

    document
    .getElementById("addModal")
    .style.display = "none";

}



// =====================================
// غلق نافذة التعديل
// =====================================

function closeEditModal(){

    document
    .getElementById("editModal")
    .style.display = "none";

}



// =====================================
// غلق نافذة آخر رقم
// =====================================

function closeLastPowerModal(){

    document
    .getElementById("lastPowerModal")
    .style.display = "none";

}



// =====================================
// Toast
// =====================================

function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display="none";

    },2000);

}



// =====================================
// غلق الـ Modal عند الضغط خارجها
// =====================================

window.onclick = function(event){

    if(

        event.target==

        document.getElementById("addModal")

    ){

        closeAddModal();

    }

    if(

        event.target==

        document.getElementById("editModal")

    ){

        closeEditModal();

    }

    if(

        event.target==

        document.getElementById("lastPowerModal")

    ){

        closeLastPowerModal();

    }

};



// =====================================
// تحديث البيانات بعد أي عملية
// =====================================

async function refreshPowers(){

    await loadAllPowers();

    searchPowers();

}
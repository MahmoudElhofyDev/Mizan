let cases =
JSON.parse(
    localStorage.getItem("cases")
) || [];



let powers =
JSON.parse(
    localStorage.getItem("powers")
) || [];



let searchTimer;









// =====================
// تأخير البحث
// =====================

function delaySearch(){


    clearTimeout(searchTimer);



    searchTimer = setTimeout(()=>{


        searchAll();


    },300);



}









// =====================
// البحث الشامل
// =====================

function searchAll(){


    let input =
    document.getElementById("searchInput");



    if(!input)
    return;



    let value =
    input.value
    .toLowerCase()
    .trim();





    if(value === ""){


        showCases([]);

        showPowers([]);


        return;


    }








    let caseResult =

    cases.filter(item=>{


        return (

            String(item.fileNumber || "")
            .toLowerCase()
            .includes(value)



            ||



            String(item.clientName || "")
            .toLowerCase()
            .includes(value)


        );


    });









    let powerResult =

    powers.filter(item=>{


        return (


            String(item.fileNumber || "")
            .toLowerCase()
            .includes(value)



            ||



            String(item.powerNumber || "")
            .toLowerCase()
            .includes(value)



            ||



            String(item.clientName || "")
            .toLowerCase()
            .includes(value)



            ||



            String(item.documentation || "")
            .toLowerCase()
            .includes(value)


        );


    });







    showCases(caseResult);


    showPowers(powerResult);



}









// =====================
// عرض القضايا
// =====================

function showCases(data){



    let table =
    document.getElementById("casesResults");



    if(!table)
    return;



    table.innerHTML = "";





    data.slice(0,100)
    .forEach(item=>{



        table.innerHTML += `

<tr>


<td>
${item.fileNumber || ""}
</td>



<td>
${item.clientName || ""}
</td>



</tr>

`;



    });



}









// =====================
// عرض التوكيلات
// =====================

function showPowers(data){



    let table =
    document.getElementById("powersResults");



    if(!table)
    return;



    table.innerHTML = "";





    data.slice(0,100)
    .forEach(item=>{



        table.innerHTML += `


<tr>


<td>
${item.documentation || ""}
</td>


<td>
${item.clientName || ""}
</td>


<td>
${item.powerNumber || ""}
</td>


<td>
${item.fileNumber || ""}
</td>



</tr>


`;



    });



}









// =====================
// تشغيل الصفحة
// =====================

window.onload = function(){


    showCases([]);


    showPowers([]);



};
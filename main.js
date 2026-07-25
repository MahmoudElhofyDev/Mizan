const { app, BrowserWindow } = require("electron");


function createWindow(){

    const win = new BrowserWindow({

        width: 1200,

        height: 800,

        minWidth: 900,

        minHeight: 600,

        autoHideMenuBar: true,

        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }

    });


    win.loadFile("dashboard.html");


    // لو عايز تفتح أدوات المطور شيل التعليق
    // win.webContents.openDevTools();

}



app.whenReady().then(()=>{

    createWindow();


    app.on("activate",()=>{

        if(BrowserWindow.getAllWindows().length === 0){

            createWindow();

        }

    });

});



app.on("window-all-closed",()=>{

    if(process.platform !== "darwin"){

        app.quit();

    }

});
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./mizan.db");

db.serialize(()=>{

    db.all(
        "SELECT name FROM sqlite_master WHERE type='table'",
        [],
        (err,tables)=>{

            console.log("TABLES:");
            console.log(tables);


            db.get(
                "SELECT COUNT(*) as count FROM cases",
                [],
                (err,row)=>{

                    console.log("CASES:", row);

                }
            );


            db.get(
                "SELECT COUNT(*) as count FROM powers",
                [],
                (err,row)=>{

                    console.log("POWERS:", row);

                    db.close();

                }
            );


        }
    );

});
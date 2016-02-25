'use strict';


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/Chinook_Sqlite.sqlite');

// Getting the # of Invoices per country and ordering them in Descending order
console.log("# of invoices per Country");
db.all(`SELECT COUNT(*) as Count,
            BillingCountry as Country
            FROM Invoice GROUP BY BillingCountry
            ORDER BY Count DESC`,
                (err, res) => {
                    if (err) throw (err);

                    console.log(res);
});

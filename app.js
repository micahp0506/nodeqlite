'use strict';


const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/Chinook_Sqlite.sqlite');
const PORT = process.env.PORT || 3000;

// Getting the # of Invoices per country and ordering them in Descending order
app.get ('/invoices-per-country', (req, res) => {
    db.all(
        `SELECT COUNT(*) as Count,
        BillingCountry as Country
        FROM Invoice GROUP BY BillingCountry
        ORDER BY Count DESC`,
            (err, data) => {
                if (err) throw (err);

                res.send({
                    data: data,
                    info: '# of invoices per country'
                });
            }
    );
});


app.get('/sales-per-year', (req, res) => {
  // How many Invoices were there in 2009 and 2011? What are the respective total sales for each of those years?
  //req.query = { filter: { year: '2009,2011' } }

  let having = '';

  if (req.query.filter) {
    having = 'HAVING';

    // Taking the query paramaters from the URL and making them an array ignoring the comma, then using map to make them an integer, having is the string that we are building for the SQL query
    req.query.filter.year
      .split(',')
      .map(y => +y)
      .forEach(y => {
        having += ` year = "${y}" OR`;
      });

    having = having.substring(0, having.length - 3);
  }

  db.all(`
    SELECT count(*) as invoices,
           sum(Total) as total,
           strftime('%Y', InvoiceDate) as year
    FROM   Invoice
    GROUP BY year
    ${having}`,
      (err, data) => {
        if (err) throw err;

        const roundedData = data.map(function (obj) {
          return {
            invoices: obj.invoices,
            year: +obj.year,
            total: +obj.total.toFixed(2)
          }
        });

        res.send({
          data: roundedData,
          info: '# of invoices and sales per year'
        });
      }
    );
});

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})

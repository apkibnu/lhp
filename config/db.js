const mysql = require('mysql');
const conLocal = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "smartsys_Monitoring_mach",
    multipleStatements: true
})

// Connection error, 2 seconds retry
conLocal.connect(function (err) {
  if (err) {
      console.log('error when connecting to db:', err);
  } else {
      console.log('Connected')
  }
});


const conTicket = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smartsys_Ticketing"
});

// Connection error, 2 seconds retry
conTicket.connect(function (err) {
  if (err) {
      console.log('error when connecting to db:', err);
  } else {
      console.log('Connected')
  }
});

const conLogin = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "smartsys_permit"
});

// Connection error, 2 seconds retry
conLogin.connect(function (err) {
    if (err) {
        console.log('error when connecting to db:', err);
        setTimeout(handleError , 2000);
    } else {
        console.log('Connected')
    }
});

module.exports = {conLocal, conTicket, conLogin}
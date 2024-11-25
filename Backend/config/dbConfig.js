const { createPool } = require("mysql2");


  const pool = createPool({
    host: "63.250.52.212",
    user: "utsavroa_admin",
    password: "Utsav@2024#",
    database: "utsavroa_db",
    // host: '63.250.52.212',
    // user: 'rajeshtr_admin',
    // password: 'Rajesh@2024#',
    // database: 'rajeshtr_db',
    connectionLimit: 10,
    multipleStatements: true
  });
  
   console.log("mysql Connected!!");
module.exports= pool


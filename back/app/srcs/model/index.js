
const config=require('../config')
var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : config.database.host,
//   user     : config.database.user,
//   password : config.database.password,
// 	port:3306,
//   //database : config.database.dbName
// });

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
	socketPath: '/tmp/mysql.sock',
	//port:3306,
  database : config.database.dbName
});
connection.connect(function(err) {
	if(err) {
		console.log('Connection is asleep (time to wake it up): ', err);
		//setTimeout(handleDisconnect, 1000);
		//handleDisconnect();
	}else {
		console.log("reussi sql");
	}
});
//connection.connect();

module.exports=connection

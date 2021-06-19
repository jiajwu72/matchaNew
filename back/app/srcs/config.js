const config = {};
require("dotenv").config()
//console.log(process.env)
config.database = {
  host: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  //port: '27017',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
}
//console.log(config.database)
/*
config.database = {
  host: 'mongodb://localhost',
  dbName: 'test',
  port: '27017',
  user: '',
  password: '',
}
*/
module.exports = config;

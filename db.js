const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('db_pgdp', 'mickaelyass', 'mickaelyass2001',
    {
  host: 'localhost',
  dialect: 'postgres',

  logging:false,
   });
module.exports=sequelize;



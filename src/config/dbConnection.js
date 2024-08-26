import { Sequelize } from "sequelize";

const dbConnect = new Sequelize ("to_do", "root", "Sen@iDev77!.",{
    host: "localhost",
    dialect: "mysql",
    
});

//test from connection database
// try {
//     await dbConnect.authenticate();
//     console.log('Connection estabilished MYSQL.');
//   } catch (error) {
//     console.error('Unable to connect to the MYSQL:', error);
//   }

export default dbConnect;
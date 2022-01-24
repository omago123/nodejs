import mariadb from "mariadb";
import dotenv from "dotenv"

dotenv.config({path:'.env-local'}); 

 const pool = mariadb.createPool({
    host: process.env.HOST ,
    user: process.env.USER ,
    password: process.env.PASS ,
    database: process.env.NAME ,
    connectionLimit: 5
});

// Connect and check for errors
 pool.getConnection((err, connection) =>{
     if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection lost');
          
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connection');
        
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Database connnection was refused');
         
        }
    }
    if(connection) connection.release();

    return;
});

export default pool
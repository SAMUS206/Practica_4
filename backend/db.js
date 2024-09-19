import mysql from 'mysql2/promise';

const connection =  mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Emmagx0903',
  database: 'mi_basededatos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection;

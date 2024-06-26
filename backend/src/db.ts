// backend/src/db.ts
import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'database-1.cxgaumyi4rp2.us-east-1.rds.amazonaws.com',
  // host: 'localhost',
  user: 'admin',
  password: 'Loadsmobile1234!',
  database: 'loadsmobile'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

export default connection;

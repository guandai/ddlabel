"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/db.ts
const mysql_1 = __importDefault(require("mysql"));
const connection = mysql_1.default.createConnection({
    host: '3dri6.mysql.rds.aliyuncs.com',
    // host: 'localhost',
    user: 'rds713461',
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
exports.default = connection;

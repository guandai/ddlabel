"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCsvPackages = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const Address_1 = require("../models/Address");
const Package_1 = require("../models/Package");
const packageControllerUtil_1 = require("./packageControllerUtil");
const uuid_1 = require("uuid");
const json2csv_1 = require("json2csv"); // Import parse from json2csv
const getCsvPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const relationQuery = (0, packageControllerUtil_1.getRelationQuery)(req);
    try {
        const packages = yield Package_1.Package.findAll(Object.assign(Object.assign({}, relationQuery), { attributes: { exclude: ['userId'] }, include: [
                {
                    model: Address_1.Address,
                    as: 'fromAddress',
                    attributes: ['address1', 'address2', 'city', 'state', 'zip', 'name', 'phone', 'email'],
                },
                {
                    model: Address_1.Address,
                    as: 'toAddress',
                    attributes: ['address1', 'address2', 'city', 'state', 'zip', 'name', 'phone', 'email'],
                },
                // {
                //   model: Transaction,
                //   as: 'transaction',
                //   attributes: ['id', 'event', 'cost'],
                // },
            ] }));
        // Convert the data to JSON
        const packagesData = packages.map(pkg => pkg.toJSON());
        // Specify fields for the CSV
        const fields = [
            'id', 'trackingNo', 'createdAt', 'updatedAt', // Package fields
            'fromAddress.name', 'fromAddress.phone', 'fromAddress.email', // From address fields
            'fromAddress.address1', 'fromAddress.address2', 'fromAddress.city', 'fromAddress.state', 'fromAddress.zip', // From address fields
            'toAddress.name', 'toAddress.phone', 'toAddress.email', // To address fields
            'toAddress.address1', 'toAddress.address2', 'toAddress.city', 'toAddress.state', 'toAddress.zip', // To address fields
            // 'transaction.transactionId', 'transaction.amount', 'transaction.currency', 'transaction.status' // Transaction fields
        ];
        // Convert JSON to CSV
        const csv = (0, json2csv_1.parse)(packagesData, { fields });
        // Set the headers to indicate a file download
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="packages_${(0, uuid_1.v4)()}.csv"`);
        // Send the CSV content as the response
        return res.send(csv);
    }
    catch (error) {
        logger_1.default.error(`Error in getPackages: ${error}`);
        return res.status(400).json({ message: error.message });
    }
});
exports.getCsvPackages = getCsvPackages;

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.getAddressById = exports.getAddresses = exports.createAddress = void 0;
const Address_1 = require("../models/Address");
// Create a new address
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, addressLine1, addressLine2, city, state, zip, country, phone } = req.body;
    try {
        const address = yield Address_1.Address.create({
            name,
            addressLine1,
            addressLine2,
            city,
            state,
            zip,
            country,
            phone,
        });
        res.status(201).json(address);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createAddress = createAddress;
// Get all addresses
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addresses = yield Address_1.Address.findAll();
        res.json(addresses);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAddresses = getAddresses;
// Get a single address by ID
const getAddressById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield Address_1.Address.findByPk(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getAddressById = getAddressById;
// Update an address
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, addressLine1, addressLine2, city, state, zip, country, phone } = req.body;
    try {
        const address = yield Address_1.Address.findByPk(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        address.name = name;
        address.addressLine1 = addressLine1;
        address.addressLine2 = addressLine2;
        address.city = city;
        address.state = state;
        address.zip = zip;
        address.country = country;
        address.phone = phone;
        yield address.save();
        res.json(address);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateAddress = updateAddress;
// Delete an address
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield Address_1.Address.findByPk(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        yield address.destroy();
        res.json({ message: 'Address deleted' });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.deleteAddress = deleteAddress;

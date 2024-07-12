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
exports.getZoneByProposalAndZip = exports.getProposalByZip = exports.getPostalZoneById = exports.getPostalZoneByZip = exports.getPostalZones = void 0;
const PostalZone_1 = require("../models/PostalZone");
const getPostalZones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postalZones = yield PostalZone_1.PostalZone.findAll();
        res.json(postalZones);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPostalZones = getPostalZones;
const getPostalZoneByZip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zip_code } = req.query;
        const postalZone = yield PostalZone_1.PostalZone.findOne({
            where: { zip_code },
        });
        if (postalZone) {
            res.json(postalZone);
        }
        else {
            res.status(404).json({ message: 'PostalZone not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPostalZoneByZip = getPostalZoneByZip;
const getPostalZoneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postalZone = yield PostalZone_1.PostalZone.findByPk(req.params.id);
        if (postalZone) {
            res.json(postalZone);
        }
        else {
            res.status(404).json({ message: 'PostalZone not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getPostalZoneById = getPostalZoneById;
const getProposalByZip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { zip_code } = req.query;
    try {
        const postalZone = yield PostalZone_1.PostalZone.findOne({
            where: { zip_code }, // Cast zip to string
        });
        if (postalZone) {
            res.json(postalZone.proposal);
        }
        else {
            res.status(404).json({ message: 'Proposal not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getProposalByZip = getProposalByZip;
const getZoneByProposalAndZip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { proposal, zip_code } = req.query;
    try {
        const postalZone = yield PostalZone_1.PostalZone.findOne({
            where: {
                zip_code,
            },
        });
        if (postalZone) {
            res.json(postalZone[proposal]);
        }
        else {
            res.status(404).json({ message: 'Zone not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getZoneByProposalAndZip = getZoneByProposalAndZip;

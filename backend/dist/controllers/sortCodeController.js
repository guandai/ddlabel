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
const SortCode_1 = require("../models/SortCode");
exports.getAllSortCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortCodes = yield SortCode_1.SortCode.findAll();
        return res.json(sortCodes);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.createSortCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSortCode = yield SortCode_1.SortCode.create(req.body);
        return res.status(201).json(newSortCode);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateSortCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updated = yield SortCode_1.SortCode.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedSortCode = yield SortCode_1.SortCode.findByPk(id);
            return res.json(updatedSortCode);
        }
        else {
            return res.status(404).json({ message: 'Sort code not found' });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.deleteSortCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield SortCode_1.SortCode.destroy({ where: { id: req.params } })) {
            return res.status(200).send({ success: true });
        }
        else {
            return res.status(422).json({ message: 'Sort code not found' });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

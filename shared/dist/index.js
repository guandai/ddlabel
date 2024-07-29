"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIELDS = exports.AddressEnum = void 0;
var AddressEnum;
(function (AddressEnum) {
    AddressEnum["user"] = "user";
    AddressEnum["package"] = "package";
})(AddressEnum = exports.AddressEnum || (exports.AddressEnum = {}));
exports.FIELDS = [
    'length', 'width', 'height', 'weight', 'reference',
    'fromName', 'fromAddress1', 'fromAddress2', 'fromAddressZip',
    'toName', 'toAddress1', 'toAddress2', 'toAddressZip'
];

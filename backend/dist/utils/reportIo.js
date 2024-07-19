"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportIoSocket = void 0;
const reportIoSocket = (eventName, req, processed, total) => {
    const io = req.io;
    const socketId = req.headers['socket-id'] || 'no-id';
    io.to(socketId || 'no-id').emit(eventName, {
        processed,
        total
    });
};
exports.reportIoSocket = reportIoSocket;
exports.default = exports.reportIoSocket;

import { Request } from 'express';

export const reportIoInsert = (req: Request, processed: number, total: number) => {
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';
	io.to(socketId).emit('progress', {
		processed,
		total
	});
};

export const reportIoGenerate = (req: Request, processed: number, total: number) => {
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';
	io.to(socketId).emit('generate', {
		processed,
		total
	});
};

export default reportIoInsert;

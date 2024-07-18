import { Request, Response } from 'express';

const reportToIo = (req: Request, processed: number, total: number) => {
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';
	io.to(socketId).emit('progress', {
		processed,
		total
	});
};

export default reportToIo;

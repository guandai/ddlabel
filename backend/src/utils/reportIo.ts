import { Request } from 'express';

export const reportIoSocket = (eventName: string, req: Request, processed: number, total: number) => {
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';

	io.to( socketId || 'no-id').emit(eventName, {
		processed,
		total
	});
};

export default reportIoSocket;

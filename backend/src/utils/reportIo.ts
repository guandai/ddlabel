import { AuthRequest } from '../types';

export const reportIoSocket = (eventName: string, req: AuthRequest, processed: number, total: number) => {
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';

	io.to( socketId || 'no-id').emit(eventName, {
		processed,
		total
	});
};

export default reportIoSocket;

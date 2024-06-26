import { AuthRequest } from '../types';

type ReportIoProp = {
	eventName: string, req: AuthRequest, processed: number, total: number;
}
export const reportIoSocket = (prop: ReportIoProp) => {
	const { eventName, req, processed, total } = prop;
	const io = req.io;
	const socketId = req.headers['socket-id'] || 'no-id';

	io.to( socketId || 'no-id').emit(eventName, {
		processed,
		total
	});
};

export default reportIoSocket;

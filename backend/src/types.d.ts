import { Request } from 'express';
export type SimpleType = {
	t: string
}  

export interface AuthRequest extends Request {
	user?: UserAttributes;
}

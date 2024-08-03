import { ResponseAdv } from "@ddlabel/shared";
import { UniqueConstraintError } from "sequelize";

export const isValidJSON = (str: string) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

export const aggregateError = (error: UniqueConstraintError | Error) => 
	error?.constructor.name === 'UniqueConstraintError' &&  'errors' in error
		? error.errors.map((e: any) => e.message).join(', ')
		: error?.message;

export const ReturnMsg = <T>(res: ResponseAdv<T>, message: string, code = 400) => res.status(code).json({ message});

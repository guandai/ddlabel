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

export const reducedError = (error: any) => {
	const stacks = error.stack.split('\n')
	const lastFnName = stacks.pop().split(' ')[5];
	const messages = [
		['name', error.name],
		['original', error.original],
		['errors', error.errors.map((e: any) => e.message)],
		['lastName', lastFnName],
	];
	return `\n${messages.map(msg => `ReducedError [${msg[0]}]: ${msg[1]}`).join('\n')}`;
}
	
export const aggregateError = (error: UniqueConstraintError | Error) => 
	error?.constructor.name === 'UniqueConstraintError' &&  'errors' in error
		? error.errors.map((e: any) => `${e.message}, ${error.original.message}`).join(', ')
		: error?.message;

export const ReturnMsg = <T>(res: ResponseAdv<T>, message: string, code = 400) => res.status(code).json({ message});

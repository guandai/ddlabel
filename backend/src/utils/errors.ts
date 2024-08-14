import { ResponseAdv } from "@ddlabel/shared";
import moment from "moment";
import { UniqueConstraintError } from "sequelize";
import { Response } from "express";
import logger from "../config/logger";
import { aggregateError, getErrorRes } from "./getErrorRes";
import { BatchCreationError } from "./errorClasses";

export const isValidJSON = (str: string) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

export const reducedConstraintError = (error: UniqueConstraintError) => {
	const stacks = error.stack?.split('\n')
	const lastFn = stacks?.pop()?.split(' ')[5] || '';
	const batchError = new BatchCreationError({
		...error,
		message: error.errors?.[0]?.message || 'Unique constraint error: Duplicate value detected.',
		original: error,
		lastFn: lastFn,
	});
	
	return aggregateError(batchError);
}

export const ReturnMsg = <T>(res: ResponseAdv<T>, message: string, code = 400) => res.status(code).json({ message });

export const isDateValid = (date: string) => moment(date, moment.ISO_8601, true).isValid();


export const resHeaderError = (fnName: string, error: any, data: unknown, res: Response) => {
	logger.error(`Error in ${fnName} -> ${error} .`);
	logger.error(`Data  in ${fnName} -> ${data} .`);
	const errorRes = getErrorRes({fnName, error, data});
	return res.status(errorRes.status).json({
		message: errorRes.message,
		errors: errorRes.errors,
	});
}

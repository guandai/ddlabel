import { ResponseAdv } from "@ddlabel/shared";
import moment from "moment";
import { ConnectionError, DatabaseError, ForeignKeyConstraintError, OptimisticLockError, TimeoutError, UniqueConstraintError, ValidationError, ValidationErrorItem } from "sequelize";
import { Response } from "express";
import logger from "../config/logger";
import { ErrorRes } from "../types";

type BatchCreationErrorParams = {
	name: string;
	message: string;
	original: any;
	lastFn: string;
	errors?: any[];
}

export const isValidJSON = (str: string) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}

export const reducedError = (error: Error | ValidationErrorItem) => 
	`\n${Object.entries(error)
		.filter(([key, _v]) => ['message', 'value', 'path', 'type'].includes(key) )
		.map(([key, value]) => `-> [${key}]: ${value}`).join('\n')}\n`

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

export const aggregateError = (error: UniqueConstraintError | Error[] | Error): string => {
	if (!error) return '';
	const constructorName = error.constructor.name;
	const title = `\n[Error Instance] ${constructorName}: `;

	if (error instanceof UniqueConstraintError) {
		return `${title} ${error.errors.map(reducedError).join(', ')}`;
	}

	if (Array.isArray(error)) {
		return `${title} ${error.map(reducedError).join(', ')}`;
	}
	
	return `${title} ${[error].map(reducedError).join(', ')}`;
}


export const ReturnMsg = <T>(res: ResponseAdv<T>, message: string, code = 400) => res.status(code).json({ message });

export const isDateValid = (date: string) => moment(date, moment.ISO_8601, true).isValid();

const logSequelizeError = (fnName: string, errRes: ErrorRes) => {
	logger.error(`SequelizeError in ${fnName}: ${aggregateError(errRes.original)}`);
	return errRes;
};

export const handleSequelizeError = (fnName: string, error: any, data: unknown) => {
	let errorRes;

	switch (true) {
		case error instanceof UniqueConstraintError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 409, message: 'Unique constraint error: Duplicate value detected.',
				errors: error.errors,
			};
			break;
		case error instanceof ValidationError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 400, message: 'Validation error: Invalid input data.',
				errors: error.errors,
			};
			break;
		case error instanceof ForeignKeyConstraintError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 400, message: 'Foreign key constraint error: Invalid reference.',
				parent: error.parent,
			};
			break;
		case error instanceof DatabaseError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 500, message: 'Database error: A general database error occurred.',
				sql: error.sql,
			};
			break;
		case error instanceof TimeoutError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 504, message: 'Database timeout error: Query execution exceeded the time limit.',
				sql: error.sql,
			};
			break;
		case error instanceof ConnectionError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 503, message: 'Database connection error: Unable to connect to the database.',
				parent: error.parent,
			};
			break;
		case error instanceof OptimisticLockError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 409, message: 'Optimistic lock error: Concurrent update conflict.',
				where: error.where,
			};
			break;

		case error instanceof NotFoundError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 404, message: error.message,
			};
			break;
		case error instanceof InvalidCredentialsError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 401, message: error.message || 'Invalid credentials provided',
			};
			break;
		case error instanceof InvalidInputError:
			errorRes = {
				original: error, data, name: error.name, 
				status: 400, message: error.message || 'Invalid input provided',
			};
			break;
		default:
			errorRes = {
				original: error, data, name: error.name, 
				status: 500, message: 'An unexpected error occurred.',
				stack: error.stack,
			};
			break;
	}

	return logSequelizeError(fnName, errorRes);
};

export const resHeaderError = (fnName: string, error: any, data: unknown, res: Response) => {
	logger.error(`Error in ${fnName} -> ${error} .`);
	logger.error(`Data  in ${fnName} -> ${data} .`);
	const errorRes = handleSequelizeError(fnName, error, data);
	return res.status(errorRes.status).json({
		message: errorRes.message,
		errors: errorRes.errors,
	});
}


export class NotFoundError extends Error {
	public status: number;

	constructor(message: string = 'Resource not found') {
		super(message);
		this.name = "NotFoundError";
		this.status = 404;
		Object.defineProperty(this, 'message', { enumerable: true });
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, NotFoundError);
		}
	}
}

export class InvalidCredentialsError extends Error {
	public status: number;

	constructor(message: string = 'Invalid credentials provided') {
		super(message);
		this.name = "InvalidCredentialsError";
		this.status = 401; // 401 Unauthorized
		Object.defineProperty(this, 'message', { enumerable: true });
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidCredentialsError);
		}
	}
}

export class InvalidInputError extends Error {
	public status: number;

	constructor(message: string = 'Invalid input provided') {
		super(message);
		this.name = "InvalidInputError";
		this.status = 400; // 401 Unauthorized
		Object.defineProperty(this, 'message', { enumerable: true });
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidInputError);
		}
	}
}

export class BatchCreationError extends Error {
    public status: number;
	public original: any;
	public errors?: any[];
	public lastFn: string;
	

    constructor(params: BatchCreationErrorParams) {
		const { name, message, original, errors, lastFn } = params;
        super(message);
        this.name = name;
        this.status = 422;
		this.original = original;
		this.lastFn = lastFn;
		this.errors = errors;
		Object.defineProperty(this, 'message', { enumerable: true });
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BatchCreationError);
        }
    }
}

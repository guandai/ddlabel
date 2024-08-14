import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError, DatabaseError, TimeoutError, ConnectionError, OptimisticLockError, ValidationErrorItem } from "sequelize";
import logger from "../config/logger";
import { ErrorRes } from "../types";
import { NotFoundError, InvalidCredentialsError, InvalidInputError } from "./errorClasses";
import { toCamelCase } from "./errors";

const reducedError = (error: Error | ValidationErrorItem) => {
    const properties = {
        name: 'name' in error ? error.name : toCamelCase(error.message),
        message: error.message,
        value: (error as any).value, // Casting to 'any' to avoid TypeScript error for non-standard properties
        path: (error as any).path,
        type: (error as any).type,
    };

    return `\n${Object.entries(properties)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `-> [${key}]: ${value}`).join('\n')}\n`;
};

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


const logSequelizeError = (fnName: string, errRes: ErrorRes, disableLog = false) => {
	!disableLog && logger.error(`SequelizeError in ${fnName}: ${aggregateError(errRes.original)}`);
	return errRes;
};
type SequelizeErrorParams = {
	fnName: string;
	error: any;
	data?: unknown;
	disableLog?: boolean;
}
export const getErrorRes = (params: SequelizeErrorParams): ErrorRes => {
	const { fnName, error, data, disableLog = false } = params;
	let errorRes;

	switch (true) {
		case error instanceof UniqueConstraintError:
			errorRes = { original: error, data, name: error.name, 
				status: 409, message: 'Unique constraint error: Duplicate value detected.',
				errors: error.errors,
			};
			break;
		case error instanceof ValidationError:
			errorRes = { original: error, data, name: error.name, 
				status: 400, message: 'Validation error: Invalid input data.',
				errors: error.errors,
			};
			break;
		case error instanceof ForeignKeyConstraintError:
			errorRes = { original: error, data, name: error.name, 
				status: 400, message: 'Foreign key constraint error: Invalid reference.',
				parent: error.parent,
			};
			break;
		case error instanceof DatabaseError:
			errorRes = { original: error, data, name: error.name, 
				status: 500, message: 'Database error: A general database error occurred.',
				sql: error.sql,
			};
			break;
		case error instanceof TimeoutError:
			errorRes = { original: error, data, name: error.name, 
				status: 504, message: 'Database timeout error: Query execution exceeded the time limit.',
				sql: error.sql,
			};
			break;
		case error instanceof ConnectionError:
			errorRes = { original: error, data, name: error.name, 
				status: 503, message: 'Database connection error: Unable to connect to the database.',
				parent: error.parent,
			};
			break;
		case error instanceof OptimisticLockError:
			errorRes = { original: error, data, name: error.name, 
				status: 409, message: 'Optimistic lock error: Concurrent update conflict.',
				where: error.where,
			};
			break;

		case error instanceof NotFoundError:
			errorRes = { original: error, data, name: error.name, 
				status: 404, message: error.message,
			};
			break;
		case error instanceof InvalidCredentialsError:
			errorRes = { original: error, data, name: error.name, 
				status: 401, message: error.message || 'Invalid credentials provided',
			};
			break;
		case error instanceof InvalidInputError:
			errorRes = { original: error, data, name: error.name, 
				status: 400, message: error.message || 'Invalid input provided',
			};
			break;
		default:
			errorRes = { original: error, data, name: error.name, 
				status: 500, message: 'An unexpected error occurred.',
				stack: error.stack,
			};
			break;
	}

	return logSequelizeError(fnName, errorRes, disableLog);
};

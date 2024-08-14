type BatchCreationErrorParams = {
	name: string;
	message: string;
	original: any;
	lastFn: string;
	errors?: any[];
}

const fixErrorClass = (scope: any , errorClass: Function) => {
	Object.defineProperty(scope, 'message', { enumerable: true });
	Object.defineProperty(scope, 'name', { enumerable: true });
	if (Error.captureStackTrace) {
		Error.captureStackTrace(scope, errorClass);
	}
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
		fixErrorClass(this, InvalidCredentialsError);
	}
}

export class InvalidInputError extends Error {
	public status: number;

	constructor(message: string = 'Invalid input provided') {
		super(message);
		this.name = "InvalidInputError";
		this.status = 400; // 401 Unauthorized
		fixErrorClass(this, InvalidCredentialsError);
	}
}

export class BatchCreationError extends Error {
    public status: number;
	public original: any;
	public lastFn: string;
	public errors?: any[];

    constructor(params: BatchCreationErrorParams) {
		const { name, message, original, errors, lastFn } = params;
        super(message);
        this.name = name;

        this.status = 422;
		this.original = original;
		this.lastFn = lastFn;
		this.errors = errors;
		fixErrorClass(this, InvalidCredentialsError);
    }
}

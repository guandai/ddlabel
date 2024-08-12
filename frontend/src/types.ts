type PkgErrorDetail = {
    "message": string,
    "type": string,
    "path": string,
    "value": string,
    "origin": "DB" | string,
    "instance": {
        "id": null | number,
        "name": string,
        "email": string,
        "password": string,
        "role": "admin" | 'worker',
        "warehouseAddress": string,
    },
    "validatorKey": "not_unique" | string,
    "validatorName": null | string,
    "validatorArgs": []
}

export type PkgCsvError = {
    "message": "Validation Error" | string,
    "errors": PkgErrorDetail[];
}

export enum MsgLevel {
    error ='error',
    success ='success',
    info ='info',
    warning ='warning'
}

export type MessageContent = {
    text: string,
    level: 'error' | 'success' | 'info' | 'warning',
} | null;

export type SearchOptions = 'address' | 'date' | 'email' | 'trackingNo';

export type GridNode = {
	label: string;
	value: JSX.Element[] | JSX.Element | string | number | undefined | null;
}

export type GridNodesSection = {
	title: string;
	gridNodes: GridNode[];
}

export type ModelActionOptions = 'view' | 'edit' | 'delete';

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

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

export type ProfileType = {
    id: number;
    name: string;
    email: string;
    password: string; 
    confirmPassword: string;
    role: string;
    warehouseAddress: AddressAttributes;
};

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

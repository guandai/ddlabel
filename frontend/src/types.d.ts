type ErrorDetail = {
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
        "updatedAt": date,
        "createdAt": date
    },
    "validatorKey": "not_unique" | string,
    "validatorName": null | string,
    "validatorArgs": []
}

export type ResError = {
    "message": "Validation error" | string,
    "errors": ErrorDetail[];
}

declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

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


export type ZonesType = Pick<PostalZoneType ,'LAX' | 'SFO' | 'ORD' | 'JFK' | 'ATL' | 'DFW' | 'MIA' | 'SEA' | 'BOS' | 'PDX'>;
export interface PostalZoneType {
  zip_code: string;
  new_sort_code: string;
  sort_code: string;
  state: string;
  city: string;
  remote_code: string;
  code: string;
  proposal: string;
  start_zip?: string;
  open_date: string;
  LAX?: string;
  SFO?: string;
  ORD?: string;
  JFK?: string;
  ATL?: string;
  DFW?: string;
  MIA?: string;
  SEA?: string;
  BOS?: string;
  PDX?: string;
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

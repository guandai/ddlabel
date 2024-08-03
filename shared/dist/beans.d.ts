export declare namespace BeansAI {
    type AddressComponents = {
        city: string;
        state: string;
        zipcode: string;
        street: string;
        countryIso3: string;
    };
    type IconColorSet = {
        default: {
            default: string;
            selected: string;
            type: string;
        };
    };
    type Position = {
        latitude: number;
        longitude: number;
    };
    type Route = {
        listRouteId: string;
    };
    type Item = {
        listItemId: string;
        address: string;
        formattedAddress: string;
        status: string;
        createdAt: number;
        updatedAt: number;
        statusUpdatedAt: number;
        route: Route;
        routePriority: number;
        trackingId: string;
        numPackages: number;
        type: string;
        customerName: string;
        position: Position;
        displayPosition: Position;
        deliverFromStr: string;
        addressComponents: AddressComponents;
        origination: string;
        sourceSeq: number;
        thirdPartyReferenceId: string;
        extraInfo1: string;
        iconId: string;
        iconColorSet: IconColorSet;
    };
    type Log = {
        listItemId: string;
        listRouteId: string;
        accountBuid: string;
        status: string;
        trackingId: string;
        type: string;
        tsMillis: number;
    };
    type Pod = {
        listItemId: string;
        listRouteId: string;
        accountBuid: string;
        timestampEpochSecond: number;
        images: {
            url: string;
            type: string;
        }[];
        eventCode: {
            code: string;
            name: string;
        };
        positionType: string;
        generatedFrom: string;
        generatedBy: string;
        consigneeName: string;
        tags: {
            key: string;
            value: string;
        }[];
        ts: number;
    };
    type StatusLog = {
        tsMillis: number;
        type: string;
        description: string;
        item: Item;
        log: Log;
        pod?: Pod;
    };
    type ListItemReadableStatusLogs = StatusLog[];
}

export namespace BeansAI {
	export type AddressComponents = {
		city: string;
		state: string;
		zipcode: string;
		street: string;
		countryIso3: string;
	};

	export type IconColorSet = {
		default: {
			default: string;
			selected: string;
			type: string;
		};
	};

	export type Position = {
		latitude: number;
		longitude: number;
	};

	export type Route = {
		listRouteId: string;
	};

	export type Item = {
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

	export type Log = {
		listItemId: string;
		listRouteId: string;
		accountBuid: string;
		status: string;
		trackingId: string;
		type: string;
		tsMillis: number;
	};

	export type Pod = {
		listItemId: string;
		listRouteId: string;
		accountBuid: string;
		timestampEpochSecond: number;
		images: { url: string; type: string }[];
		eventCode: { code: string; name: string };
		positionType: string;
		generatedFrom: string;
		generatedBy: string;
		consigneeName: string;
		tags: { key: string; value: string }[];
		ts: number;
	};

	export type StatusLog = {
		tsMillis: number;
		type: string;
		description: string;
		item: Item;
		log: Log;
		pod?: Pod;
	};

	export type ListItemReadableStatusLogs = StatusLog[];
}

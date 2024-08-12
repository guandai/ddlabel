export namespace BeansAI {
	export type ItemId = {
		listItemId: string;
		route: RouteId;
	}

	export type ItemIdList = {
		item: ItemId[]
	}

	export interface ItemList {
		item: Item[];
	}

	export interface Dimensions {
		length: number;
		width: number;
		height: number;
	}

	export interface RouteList {
		route: Route[];
	}

	export interface Route {
		listRouteId: string;
		name: string;
		dateStr: string; // in the format YYYY-MM-DD
		status: 'OPEN' | 'CLOSED';
		assignee?: Assignee;
		warehouse?: Warehouse;
		updatedAt: number; // EpochMillis
		// field in new api:
		accountBuid: string
		createdAt: string
		routePathMd5: string
		routeType: 'DEFAULT' | 'TEMPLATE'
		startMode: 'warehouse' | 'custom' | 'first_stop'
		endMode: 'warehouse' | 'custom' | 'anywhere'
	}

	export interface Assignee {
		listAssigneeId: string;
		name: string;
		email?: string;
		phone?: string;
		state: 'ACTIVE' | 'DISABLED';
		role: 'OWNER' | 'MANAGER' | 'DRIVER';
		latitude?: number;
		longitude?: number;
		positionsUpdatedAtMillis?: number;
		updatedAt: number;
	}

	export interface Warehouse {
		listWarehouseId: string;
		address: string;
		formattedAddress?: string;
		position?: LatLng;
		updatedAt: number; // EpochMillis
	}

	export interface LatLng {
		latitude: number;
		longitude: number;
	}

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

	export type RouteId = {
		listRouteId: string;
	};

	export type Item = {
		listItemId: string;
		route?: Route; // Optional, depending on the API response
		type: 'DROPOFF' | 'PICKUP';
		address: string;
		formattedAddress?: string;
		unit?: string;
		skipGeocoder?: boolean;
		position?: LatLng;
		customerName?: string;
		customerPhone?: string;
		notes?: string;
		trackingId?: string;
		numPackages?: number; // Defaults to 1 if omitted
		dimensions?: Dimensions;
		status: 'NEW' | 'FINISHED' | 'FAILED' | 'NOLOCATION';
		statusUpdatedAt?: number; // EpochMillis
		stopTimeSeconds?: number; // Default 60s
		flavors?: string; // Comma separated list of flavors, e.g., "HOT,REFRIGERATED"
		updatedAt: number; // EpochMillis
		signatureRequired?: boolean;
		// field in new api:
		createdAt: number;
		routePriority: number;
		displayPosition: LatLng;
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

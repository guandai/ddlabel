import { PKG_FIELDS } from "./constants";
import { HeaderMapping, KeyOfBaseData } from "./types";

export const defaultMapping = PKG_FIELDS.reduce((acc: HeaderMapping, field: KeyOfBaseData) => {
	Object.assign(acc, { [field]: field });
	return acc;
}, {} as HeaderMapping);

import { PostalZoneAttributes, KeyZones } from "@ddlabel/shared";
import axios from "axios";

export class PostalZoneApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	getPostZone = async (zip_code: string) => (await axios.get<PostalZoneAttributes>(`${process.env.REACT_APP_BE_URL}/postal_zones/get_post_zone`, {
		...this.config,
		params: { zip_code },
	})).data;

	getZone = async ( zip_code: string, proposal: KeyZones ) => 
		(await axios.get<string>(`${process.env.REACT_APP_BE_URL}/postal_zones/get_zone`,{ params: {zip_code, proposal}})).data;
}

const api = new PostalZoneApi()
export default api;

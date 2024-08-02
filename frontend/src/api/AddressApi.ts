import { GetAddressRes, UpdateAddressReq, UpdateAddressRes } from "@ddlabel/shared";
import axios from "axios";

export class AddressApi {
	// get packages
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	public async getAddress() {
		return await axios.get<GetAddressRes>(`/api/address`, this.config);
	}
	public async updateAddress(payload: UpdateAddressReq) {
		return await axios.put<UpdateAddressRes>(`/api/address`, payload, this.config);
	}
}

const api = new AddressApi();
export default api;

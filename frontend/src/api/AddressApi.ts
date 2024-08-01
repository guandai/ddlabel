import axios from "axios";
import { AddressAttributes } from "@ddlabel/shared";

export class AddressApi {
	// get packages
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	public async getAddress() {
		return await axios.get(`/api/address`, this.config);
	}
	public async addAddress(address: AddressAttributes) {
		return await axios.post(`/api/address`, address, this.config);
	}
	public async deleteAddress(id: number) {
		return await axios.delete(`/api/address/${id}`, this.config);
	}
	public async updateAddress(address: AddressAttributes) {
		return await axios.put(`/api/address`, address, this.config);
	}
}

const api = new AddressApi();
export default api;

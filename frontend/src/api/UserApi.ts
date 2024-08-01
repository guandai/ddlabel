import axios from "axios";
import { LoginReq, UserRegisterReq, UserUpdateReq } from "@ddlabel/shared";

export class UserApi {
	private path = `${process.env.REACT_APP_BE_URL}/users`;
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	public async getCurrentUser() {
		return await axios.get(`${this.path}/me`, this.config);
	}
	public async updateUser(data: UserUpdateReq) {
		return await axios.put(`${this.path}/user`, data, this.config);
	}
	public async login(data: LoginReq) {
		return await axios.post(`${this.path}/login`, data, this.config);
	}
	public async register(profileToUpdate: UserRegisterReq) {
		return await axios.post(`${this.path}/register`, profileToUpdate, this.config);
	}
}

const api = new UserApi();
export default api;

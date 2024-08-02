import axios from "axios";
import { LoginUserReq, GetCurrentUserRes, LoginUserRes, UpdateUserRes, RegisterUserReq, RegisterUserRes, UpdateUserReq } from "@ddlabel/shared";

export class UserApi {
	private path = `${process.env.REACT_APP_BE_URL}/users`;
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	public async getCurrentUser() {
		return (await axios.get<GetCurrentUserRes>(`${this.path}/me`, this.config)).data;
	}
	public async updateUser(payload: UpdateUserReq) {
		return (await axios.put<UpdateUserRes>(`${this.path}/me`, payload, this.config)).data;
	}
	public async login(payload: LoginUserReq) {
		return (await axios.post<LoginUserRes>(`${this.path}/login`, payload, this.config)).data;
	}
	public async register(payload: RegisterUserReq) {
		return (await axios.post<RegisterUserRes>(`${this.path}/register`, payload, this.config)).data;
	}
}

const api = new UserApi();
export default api;

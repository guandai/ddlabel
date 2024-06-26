import axios from "axios";

export class RateApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	getFullRate = async (params: Record<string, unknown>) =>
		(await axios.get(`${process.env.REACT_APP_BE_URL}/shipping_rates/full-rate`, {...this.config, params})).data;
}

const api = new RateApi();
export default api;

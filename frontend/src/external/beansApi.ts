import axios from "axios";
import { GetStatusLogRes, GetStatusLogReq } from "@ddlabel/shared";

export class BeansStatusLogApi {
	private path = `${process.env.REACT_APP_BEANS_API_URL}/status_logs`;
	private config = { headers: { Authorization: `${process.env.REACT_APP_BEANS_API_KEY}` } };
	public async getStatusLog(req: GetStatusLogReq) {
		const params = {
			tracking_id: req.trackingNo,
			readable:true,
			include_pod:true,
			include_item:true,};
		return (await axios.get<GetStatusLogRes>(`${this.path}/`, {...this.config, params})).data;
	}
}

const api = new BeansStatusLogApi();
export default api;

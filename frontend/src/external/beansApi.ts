import axios from "axios";
import { GetStatusLogRes, GetStatusLogReq, BeansAI } from "@ddlabel/shared";
// https://isp.beans.ai/enterprise/v1/lists/itemsdocumentation/ky15d3jqrqf2dr49mgqgl?returnEmptyIfMissing=true
export class BeansAiApi {
	private path = `${process.env.REACT_APP_BEANS_API_URL}`;
	private config = { headers: { Authorization: `${process.env.REACT_APP_BEANS_API_KEY}` } };
	public async getStatusLog(req: GetStatusLogReq) {
		const params = {
			tracking_id: req.trackingNo,
			readable:true,
			include_pod:true,
			include_item:true,};
		return (await axios.get<GetStatusLogRes>(`${this.path}/status_logs`, {...this.config, params})).data;
	}
	public async getPod(itemId: string) {
		return (await axios.get<BeansAI.Pod>(`${this.path}/itemsdocumentation/${itemId}?returnEmptyIfMissing=true`, {...this.config})).data;
	}
}

const api = new BeansAiApi();
export default api;

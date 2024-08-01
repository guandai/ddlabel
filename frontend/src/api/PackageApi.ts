import axios, { AxiosProgressEvent } from "axios";

export class PackageApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

	getPackages = async(params? : Record<string, unknown> ) => (await axios.get(`${process.env.REACT_APP_BE_URL}/packages`, {...this.config, params})).data

	getPackageById = async(id: string) => (await axios.get(`${process.env.REACT_APP_BE_URL}/packages/${id}`, this.config)).data

	createPackage = async(data: any) => (await axios.post(`${process.env.REACT_APP_BE_URL}/packages`, data, this.config)).data

	updatePackage = async(id: string, data: any) => (await axios.put(`${process.env.REACT_APP_BE_URL}/packages/${id}`, data, this.config)).data
	
	deletePackage = async(id: string) => (await axios.delete(`${process.env.REACT_APP_BE_URL}/packages/${id}`, this.config)).data
	
	importPackage = async(data: any, onUploadProgress: ((progressEvent: AxiosProgressEvent) => void), socketId?: string) => 
		(await axios.post(
			`${process.env.REACT_APP_BE_URL}/packages/import`, 
			data, {
				headers: {
					...this.config.headers,
					'Content-Type': 'multipart/form-data',
					'socket-id': socketId,
				},
				onUploadProgress,
			}
		)).data
}

const api = new PackageApi();
export default api;

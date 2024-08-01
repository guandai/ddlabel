import axios from "axios";

export class TransactionApi {
	private config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
	getTransactions = async (params?: Record<string, unknown>) => (await axios.get(`${process.env.REACT_APP_BE_URL}/transactions`, { ...this.config, params })).data
	getTransactionById = async (id: string) => (await axios.get(`${process.env.REACT_APP_BE_URL}/transactions/${id}`, this.config)).data
}

const api = new TransactionApi();
export default api;

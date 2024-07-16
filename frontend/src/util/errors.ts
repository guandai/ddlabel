import axios, { AxiosError } from "axios";
import { ResError } from "../types";

type SetError = (value: React.SetStateAction<string | null>) => void;

const tryError = (setError: SetError, error: any ) => {
    const errorData = ((error as AxiosError).response?.data as ResError);
    let message = 'Failed to perform the operation.';
    const errors = errorData?.errors;
      if (errors && errors.length > 0 ) {
        message = errors[0].message;
      } else if (errorData?.message) {
        message = errorData.message;
      }
      setError(message);
}

export const tryLoad = async <T, P = void>(setError: SetError, callback: () => Promise<T>, errorCallback?: () => Promise<P>) => {
    try {
      return await callback();
    } catch (error) {
      tryError(setError, error);
      return errorCallback ? await errorCallback() : '';
    }
}

export const loadApi = async<T>(setError: SetError, path: string, params: unknown) => tryLoad<T>(setError, async () => {
  const responst = await axios.get<T>(`${ process.env.REACT_APP_BE_URL}/${path}`, {params});
  return responst.data;
})

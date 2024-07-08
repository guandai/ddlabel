import { AxiosError } from "axios";
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

export const tryLoad = async (setError: SetError, callback: () => Promise<void>, errorCallback?: () => Promise<void>) => {
    try {
      return await callback();
    } catch (error) {
      tryError(setError, error);
      return errorCallback ? await errorCallback() : '';
    }
}

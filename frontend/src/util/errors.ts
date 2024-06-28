import { AxiosError } from "axios";
import { ResError } from "../types";

type SetError = (value: React.SetStateAction<string | null>) => void;

const tryError = (error: any, setError: SetError
) => {
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

export const tryLoad = async (callback: () => Promise<void>, setError: SetError) => {
    try {
      await callback();
    } catch (error) {
        tryError(error, setError);
    }
}

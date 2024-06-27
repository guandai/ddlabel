import { AxiosError } from "axios";
import { ResError } from "../types";

type SetError = (value: React.SetStateAction<string | null>) => void;

const tryError = (error: any, setError: SetError
) => {
    const err = ((error as AxiosError).response?.data as ResError).errors;
      if (err.length > 0) {
        setError(err[0].message);
        return;
      }
      setError('Failed to register. Please try again.');
}

export const tryLoad = async (callback: () => Promise<void>, setError: SetError) => {
    try {
      await callback();
    } catch (error) {
        tryError(error, setError);
    }
}

import { AxiosError } from "axios";
import { MessageContent, PkgCsvError } from "../types.d";
import React from "react";

export type SetMessage = (value: React.SetStateAction<MessageContent>) => void;

const tryError = (setMessage: SetMessage, name: string, error: AxiosError) => {
  const errorData = ((error as AxiosError).response?.data as PkgCsvError);
  let message = `${name} met error: ${error}`;
  if (errorData && errorData.errors &&Array.isArray(errorData.errors)) {
    message = errorData.errors.map((err) => err.message).join('\n');
  } else {
    message = errorData?.message || error?.message || message;
  }
  setMessage({ text: message, level: 'error' });
}

export const tryLoad = async <T, P = void>(
  setMessage: SetMessage,
  callback: () => Promise<T>,
  errorCallback?: (() => Promise<P>) | (() => void)
) => {
  try {
    return await callback();
  } catch (error) {
    const err = error as AxiosError;
    tryError(setMessage, callback.name, err);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return errorCallback?.();
  }
}

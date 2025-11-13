import { AxiosRequestHeaders } from 'axios';

export interface ICommonHeaderProperties extends AxiosRequestHeaders {
  'Content-Type'?: string;
  Authorization?: string;
}

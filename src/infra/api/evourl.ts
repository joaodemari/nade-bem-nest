import { EVO_CRED } from '../../core/utils/dotenvConfig';
import axios, { AxiosInstance } from 'axios';

export const getEvoUrl = (token: string): AxiosInstance => {
  return axios.create({
    baseURL: 'https://evo-integracao.w12app.com.br/api/v1',
    headers: {
      Authorization: `Basic ${btoa(token)}`,
    },
  });
};

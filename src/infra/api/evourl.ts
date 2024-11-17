import axios, { AxiosInstance } from 'axios';

export const getEvoUrl = (token: string): AxiosInstance => {
  const encryptedCredentials = btoa(token);
  console.log('encryptedCredentials', encryptedCredentials);
  return axios.create({
    baseURL: 'https://evo-integracao.w12app.com.br/api/v1',
    headers: {
      Authorization: `Basic ${encryptedCredentials}`,
    },
  });
};

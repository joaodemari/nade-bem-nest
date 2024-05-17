import { EVO_CRED } from '../../core/utils/dotenvConfig';
import axios from 'axios';

import { Response } from 'express';
export default async (req: { query: { email: string } }, res: Response) => {
  try {
    const { email } = req.query;
    const credentials = btoa(EVO_CRED);

    const { data } = await axios.get(
      `https://evo-integracao.w12app.com.br/api/v1/members/resetPassword?user=${email}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );

    res.json(data);
  } catch (e) {
    res.status(400).send(e);
  }
};

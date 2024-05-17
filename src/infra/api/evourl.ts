import { EVO_CRED } from "../../core/utils/dotenvConfig";
import axios from "axios";

const credentials = btoa(EVO_CRED);
export const evourl = axios.create({
    baseURL: "https://evo-integracao.w12app.com.br/api/v1",
    headers: {
        Authorization: `Basic ${credentials}`, // Use btoa here
    },
});

import { config } from "dotenv";

config();
export const EVO_CRED = process.env.EVO_CRED!;
export const SECRET_KEY = process.env.JWT_PRIVATE_KEY!;
export const PORT = +process.env.PORT!;
export const SYSTEM_URL = process.env.SYSTEM_URL!;

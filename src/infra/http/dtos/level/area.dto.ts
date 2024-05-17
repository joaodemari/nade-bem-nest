import { z } from "zod";

({
    lastReportStepId: string;
    steps: Step[];
} & Area)[];


export const areaSchema = z.object({
    id: z.string(),
    name: z.string(),
    levelId: z.string(),
});
import { z } from 'zod';

// UpdateSwimmerTeacherProps

// export const ListAllSwimmersPropsSchema = z.object({

// });

// export class ListAllSwimmersProps extends createZodDto(
//   ListAllSwimmersPropsSchema,
// ) {}

export interface UpdateSwimmerTeacherProps {
  teacherNumber: number;
  swimmerNumber: number;
  branchId: string;
}

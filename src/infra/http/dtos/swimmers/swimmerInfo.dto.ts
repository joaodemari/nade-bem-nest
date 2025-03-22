import { Teacher } from '@prisma/client';

export type SwimmerInfoResponse = {
  swimmer: {
    name: string;
    actualLevelName: string;
    photoUrl: string;
    teacher: Teacher;
  };
  reports: {
    periodName: string;
    teacherName: string;
    level: string;
    id: string;
  }[];
};

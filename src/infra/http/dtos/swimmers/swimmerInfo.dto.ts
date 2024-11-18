export type SwimmerInfoResponse = {
  swimmer: {
    name: string;
    actualLevel: string;
    photoUrl: string;
  };
  reports: {
    periodName: string;
    teacherName: string;
    level: string;
    id: string;
  }[];
};

export type SwimmerInfoResponse = {
  swimmer: {
    name: string;
    actualLevel: string;
    photoUrl: string;
  };
  reports: {
    period: string;
    teacherName: string;
    level: string;
    id: string;
  }[];
};

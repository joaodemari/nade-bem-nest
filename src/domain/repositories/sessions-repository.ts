import { Role } from '../enums/role.enum';

export abstract class SessionsRepository {
  abstract getVisitsByRange(props: GetVisitsByRangeProps): Promise<{
    visits: number;
  }>;
}
export type GetVisitsByRangeProps = {
  start: Date;
  end: Date;
  role: Role;
  branchId: string;
};

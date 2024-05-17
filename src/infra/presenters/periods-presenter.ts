import { PeriodEntity } from '../../domain/entities/PeriodEntity';

export class PeriodPresenter {
  static toHTTP(period: PeriodEntity | PeriodEntity[] | null) {
    if (!period) return null;
    if (period instanceof Array) {
      return period.map((period) => {
        return {
          id: period.id.toString(),
          name: period.name,
          startDate: period.startDate,
          endDate: period.endDate,
        };
      });
    }
    return {
      id: period.id.toString(),
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
    };
  }
}

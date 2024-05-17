import { BaseEntity } from 'src/core/generic/base-entity';

export interface PeriodInterface {
  name: string;
  startDate: Date;
  endDate: Date;
}

export class PeriodEntity extends BaseEntity<PeriodInterface> {
  static create(props: PeriodInterface, id?: string) {
    return new PeriodEntity(props, id);
  }

  get name() {
    return this.props.name;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }
}

import { BaseEntity } from '../../core/generic/base-entity';

export interface BranchInterface {
  name: string;
  apiKey: string;
}

export class BranchEntity extends BaseEntity<BranchInterface> {
  static create(props: BranchInterface, id?: string) {
    return new BranchEntity(props, id);
  }

  get name() {
    return this.props.name;
  }

  get apiKey() {
    return this.props.apiKey;
}ba
}

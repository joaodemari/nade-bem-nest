import { BaseEntity } from '../../core/generic/base-entity';

export interface ResponsibleInterface {
  email: string;
  password?: string | null;
  resetToken?: string | null;
}

export class ResponsibleEntity extends BaseEntity<ResponsibleInterface> {
  static create(props: ResponsibleInterface, id?: string) {
    return new ResponsibleEntity(props, id);
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password || '';
  }

  get resetToken() {
    return this.props.resetToken || '';
  }
}

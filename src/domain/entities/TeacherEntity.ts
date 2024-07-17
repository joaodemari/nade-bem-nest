import { BaseEntity } from '../../core/generic/base-entity';

export interface TeacherInterface {
  teacherNumber: number;
  name: string;
  photoUrl?: string | null;
  email: string;
  password?: string | null;
  resetToken?: string | null;
  branchId: string;
  authId: string;
}

export class TeacherEntity extends BaseEntity<TeacherInterface> {
  static create(props: TeacherInterface, id?: string) {
    return new TeacherEntity(props, id);
  }

  get authId() {
    return this.props.authId;
  }

  get branchId() {
    return this.props.branchId;
  }

  get teacherNumber() {
    return this.props.teacherNumber;
  }

  get name() {
    return this.props.name;
  }

  get photoUrl() {
    return this.props.photoUrl || '';
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

  set resetToken(token: string) {
    this.props.resetToken = token;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set photoUrl(photoUrl: string) {
    this.props.photoUrl = photoUrl;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set name(name: string) {
    this.props.name = name;
  }
}

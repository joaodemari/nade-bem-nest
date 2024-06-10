import { BaseEntity } from '../../core/generic/base-entity';

export interface SwimmerInterface {
  memberNumber: number;
  name: string;
  photoUrl: string | null;
  isActive: boolean;
  lastAccess: string;
  actualLevelName: string;
  teacherNumber: number | null;
  lastReport?: string;
  lastReportId?: string;
}

export class SwimmerEntity extends BaseEntity<SwimmerInterface> {
  static create(props: SwimmerInterface, id?: string) {
    return new SwimmerEntity(props, id);
  }

  get memberNumber() {
    return this.props.memberNumber;
  }

  get isActive() {
    return this.props.isActive;
  }
  get name() {
    return this.props.name;
  }

  get photoUrl() {
    return this.props.photoUrl;
  }

  get lastAccess() {
    return this.props.lastAccess;
  }

  get actualLevelName() {
    return this.props.actualLevelName;
  }

  get teacherNumber() {
    return this.props.teacherNumber;
  }

  get lastReport() {
    return this.props.lastReport;
  }

  get lastReportId() {
    return this.props.lastReportId;
  }
}

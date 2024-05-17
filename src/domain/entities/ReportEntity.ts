import { BaseEntity } from 'src/core/generic/base-entity';

export interface ReportEntityProps {
  idSwimmer: string;
  idTeacher: string;
  observation: string;
  approved: boolean;
  createdAt: Date;
  isAvailable: boolean;
  levelId: string;
  periodId?: string;
  branchId: string;
}

export class ReportEntity extends BaseEntity<ReportEntityProps> {
  static create(props: ReportEntityProps, id?: string) {
    return new ReportEntity(props, id);
  }

  get idSwimmer(): string {
    return this.props.idSwimmer;
  }

  set idSwimmer(value: string) {
    this.props.idSwimmer = value;
  }

  get idTeacher(): string {
    return this.props.idTeacher;
  }

  set idTeacher(value: string) {
    this.props.idTeacher = value;
  }

  get observation(): string {
    return this.props.observation;
  }

  set observation(value: string) {
    this.props.observation = value;
  }

  get approved(): boolean {
    return this.props.approved;
  }

  set approved(value: boolean) {
    this.props.approved = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set createdAt(value: Date) {
    this.props.createdAt = value;
  }

  get isAvailable(): boolean {
    return this.props.isAvailable;
  }

  set isAvailable(value: boolean) {
    this.props.isAvailable = value;
  }

  get levelId(): string {
    return this.props.levelId;
  }

  set levelId(value: string) {
    this.props.levelId = value;
  }

  get periodId(): string {
    return this.props.periodId;
  }

  set periodId(value: string) {
    this.props.periodId = value;
  }

  get branchId(): string {
    return this.props.branchId;
  }

  set branchId(value: string) {
    this.props.branchId = value;
  }
}

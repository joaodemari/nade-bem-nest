import { ObjectId } from 'mongodb';

export abstract class BaseEntity<Props> {
  private _id: string;
  protected props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: string) {
    this.props = props;
    this._id = id ?? new ObjectId().toString();
  }

  public equals(entity: BaseEntity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}

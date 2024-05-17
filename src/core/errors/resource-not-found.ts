import { UseCaseError } from './use-case-error';

export class ResourceNotFound extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`"${identifier}" was not found`);
  }
}

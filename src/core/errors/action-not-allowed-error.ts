import { UseCaseError } from './use-case-error';

export class ActionNotAllowed extends Error implements UseCaseError {
  constructor(identifier: string, reason: string) {
    super(
      `Member "${identifier}" is not allowed to do this action.Why? "${reason}"`,
    );
  }
}

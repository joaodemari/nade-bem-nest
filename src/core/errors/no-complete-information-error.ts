import { UseCaseError } from './use-case-error';
export class NoCompleteInformation extends Error implements UseCaseError {
  constructor(info: string) {
    super(`Information required and not given. Which?"${info}"`);
  }
}

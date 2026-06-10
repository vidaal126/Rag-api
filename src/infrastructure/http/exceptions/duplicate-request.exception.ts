import { DomainException } from './domain.exception';

export class DuplicateRequestException extends DomainException {
  constructor(
    message: string,
    public readonly existingResourceId: string,
  ) {
    super(message);
  }
}

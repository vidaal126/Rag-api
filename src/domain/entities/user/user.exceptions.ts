import { BusinessRuleException } from '@infrastructure/http/exceptions/business-rule.exception';
import { DomainNotFoundException } from '@infrastructure/http/exceptions/not-found.exception';
import { ValidationException } from '@infrastructure/http/exceptions/validation.exception';

export class InvalidEmailException extends ValidationException {
  constructor(raw: string) {
    super(`Invalid email address: ${raw}`);
  }
}

export class UserAlreadyExistsException extends BusinessRuleException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class UserNotFoundException extends DomainNotFoundException {
  constructor(id: string) {
    super(`User ${id} not found`);
  }
}

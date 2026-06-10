import { describe, expect, it } from 'vitest';
import { Email } from './email.vo';
import { InvalidEmailException } from './user.exceptions';

describe('Email', () => {
  it('creates a normalized email', () => {
    const email = Email.create('  Jane@Example.COM ');
    expect(email.value).toBe('jane@example.com');
  });

  it('throws InvalidEmailException for malformed input', () => {
    expect(() => Email.create('not-an-email')).toThrow(InvalidEmailException);
  });

  it('compares by value', () => {
    const a = Email.create('jane@example.com');
    const b = Email.create('JANE@example.com');
    expect(a.equals(b)).toBe(true);
  });

  it('reconstitutes without validation', () => {
    const email = Email.reconstitute('jane@example.com');
    expect(email.value).toBe('jane@example.com');
  });
});

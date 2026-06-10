import { describe, expect, it } from 'vitest';
import { Email } from './email.vo';
import { User } from './user.entity';

describe('User', () => {
  it('registers a new user with generated id and timestamps', () => {
    const user = User.register(Email.create('jane@example.com'), 'Jane Doe');

    expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(user.email.value).toBe('jane@example.com');
    expect(user.name).toBe('Jane Doe');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('renames and touches updatedAt', () => {
    const user = User.register(Email.create('jane@example.com'), 'Jane Doe');
    const before = user.updatedAt;

    user.rename('Jane Smith');

    expect(user.name).toBe('Jane Smith');
    expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('reconstitutes from persisted props', () => {
    const props = {
      id: 'f3b9c0a4-7c44-4f6e-9a64-0e1a2b3c4d5e',
      email: Email.reconstitute('jane@example.com'),
      name: 'Jane Doe',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
    };

    const user = User.reconstitute(props);

    expect(user.id).toBe(props.id);
    expect(user.createdAt).toEqual(props.createdAt);
  });
});

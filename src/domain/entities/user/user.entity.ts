import { randomUUID } from 'node:crypto';
import type { Email } from './email.vo';

interface UserProps {
  id: string;
  email: Email;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private readonly props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static register(email: Email, name: string): User {
    return new User({
      id: randomUUID(),
      email,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(newName: string): void {
    this.props.name = newName;
    this.props.updatedAt = new Date();
  }
}

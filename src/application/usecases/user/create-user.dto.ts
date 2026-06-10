export interface CreateUserInput {
  email: string;
  name: string;
}

export interface CreateUserOutput {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface GetUserInput {
  id: string;
}

export interface GetUserOutput {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

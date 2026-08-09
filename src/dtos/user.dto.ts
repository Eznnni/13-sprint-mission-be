export type CreateUserDto = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
};

export type SigninUserDto = {
  email: string;
  password: string;
};

export type PaginationDto = {
  page: string;
  pageSize: string;
  keyword: string;
};

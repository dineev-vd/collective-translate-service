export class PostUserDto {
  email: string;
  password: string;
  name: string;
}

export class ChangeUserDto {
  email?: string;
  password?: string;
  name?: string;
  info?: string;
}

export class GetUserDto {
  id: string;
  name: string;
  email: string;
  info: string;
}

export class GetShortUserDto {
  id: string;
  name: string;
}

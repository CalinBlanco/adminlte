
export class Usuario {
  constructor(
    public nombres: string,
    public apePaterno: string,
    public apeMaterno: string,
    public email: string,
    public password: string,
    public img?: string,
    public role?: string,
    public google?: boolean,
    public _id?: string

  ){}
}
export interface IFileDetails {
  nome: string;
  file_name: string;
  cd_func: number;
  file_size: number;
  cd_status2: number;
  dt_disponibilizacao: string | null;
  prazo_vencimento: string | null;
  apenas_link: string;
}

export type IRecipient = {
  nome: string;
  email: string;
};

export interface IFile {
  id?: number;
  nome: string;
  file_name: string;
  cd_func: number;
  file_size: number;
  cd_status2: number;
  dt_disponibilizacao: string | null;
  prazo_vencimento: string | null;
  status2: {
    cd_status2: number;
    nm_status2: string;
  };
  funcionario: {
    cd_func: number;
    nm_func: string;
    email: string;
  };
}

export type TReadOnlyFile = {
  readonly [k in keyof IFile]: IFile[k];
};

export interface IAuth {
  cdFunc: number;
  token: string;
}

export type TIOCreated = {
  nm_io: string;
  id_docs_tipo: number;
  cd_func_responsavel: number;
  cd_dp: number;
  cd_status2: number;
  obsolescencia_timestamp: null | string;
  cd_io: number;
  created_at: string;
  updated_at: string;
};

export interface INewIO {
  nm_io: string;
  id_docs_tipo: number;
  cd_func_responsavel: number;
  cd_dp: number;
  descricao: string;
  aprovadores: number[];
  insumos: string[] | undefined;
}

export interface INewPreexisting extends INewIO {
  file: File;
  cd_io: number;
  versao: number;
}

export interface INewVersion {
  descricao: string;
  aprovadores: number[];
  file: File;
  cd_io: number;
}

export type IoInsumo = {
  cd_ins: string;
  io: string;
};

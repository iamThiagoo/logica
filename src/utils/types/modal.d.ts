import { modalMap } from '@/utils/types/map/modal-map';

export interface IModalState {
  component: any;
  props: Record<string, any>;
  open: boolean;
}

export type ModalKey = keyof typeof modalMap;

export type ModalComponent = (typeof modalMap)[ModalKey];

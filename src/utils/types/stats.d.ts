export type TPeriod = 'daily' | 'weekly' | 'monthly';

export interface IStat {
  title: string;
  icon: string;
  value: number | string;
  to: string;
  variation: number;
  formatter?: (value: number) => string;
}

export interface IRange {
  start: Date;
  end: Date;
}

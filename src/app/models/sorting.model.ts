export interface Sorting {
  field: string;
  direction: SortingDirection;
}

export enum SortingDirection {
  ASC,
  DESC,
}

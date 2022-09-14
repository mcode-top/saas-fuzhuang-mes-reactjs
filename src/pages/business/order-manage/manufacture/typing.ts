export type ManufactureLocationQuery = {
  type: 'update' | 'watch' | 'create' | 'approve';
  id: number;
  infoTitle: string;
};

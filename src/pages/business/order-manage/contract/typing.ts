export type ContractLocationQuery = {
  type: 'update' | 'watch' | 'create' | 'approve';
  contractNumber?: string;
  infoTitle?: string;
};

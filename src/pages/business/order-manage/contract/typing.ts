import type { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';

export type ContractLocationQuery = {
  type: 'update' | 'watch' | 'create' | 'approve';
  contractNumber?: string;
  infoTitle?: string;
  orderType?: BusOrderTypeEnum;
};

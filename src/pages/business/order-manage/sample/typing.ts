import type { BusOrderTypeEnum } from '@/apis/business/order-manage/contract/typing';

/**@name 寄样单路由参数 */
export type SampleSendLocationQuery = {
  type: 'update' | 'watch' | 'create' | 'approve';
  contractNumber?: string;
  infoTitle?: string;
  orderType?: BusOrderTypeEnum;
};

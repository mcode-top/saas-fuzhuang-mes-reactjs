import { UserListItem } from '@/apis/person/typings';

/**@name 工位管理类型 */
export type BusStationType = {
  id?: number;
  name: string;
  device: string;
  remark: string;
  userList?: number[] | UserListItem;
};

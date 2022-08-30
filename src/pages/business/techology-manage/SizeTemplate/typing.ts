import { UserListItem } from '@/apis/person/typings';

/**@name 尺码模板父类型 */
export type BusSizeTemplateParentType = {
  id?: number;
  name: string;
  remark?: string;
  parentId: -1;
};
/**@name 尺码模板子类型 */
export type BusSizeTemplateItemType = {
  id?: number;
  name: string;
  specification: string;
  remark?: string;
  parentId: number;
};

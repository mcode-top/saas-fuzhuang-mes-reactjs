import type { ContextMenuParams, TriggerEvent } from 'react-contexify';

/**@name 菜单实例 */
export type RightMenuInstance = {
  /**@name 显示右键菜单 */
  show: (
    event: TriggerEvent,
    params?: Pick<ContextMenuParams, 'id' | 'props' | 'position'> | undefined,
  ) => void;
};
/**@name labelValue类型 */
export type LabelValue = {
  label: string;
  value: any;
};

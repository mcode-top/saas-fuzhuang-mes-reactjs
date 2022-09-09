/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-01 09:36:34
 * @Description: 用户接口传参类型
 */
export type LoginDTO = {
  username: string;
  password: string;
};

export type UserInfo = {
  username: string;
  headImage: string;
  id: number;
  deptId: number;
  roleList: any[];
  name: string;
  phone: string;
  email: string;
  dept: any;
  /**@name 状态 0:禁用 1:启用 */
  status: number;
  sex: UserSexEnum;
  [key: string]: any;
};
/**@name 性别类型 */
export enum UserSexEnum {
  /**@name 女 */
  WoMan = '0',
  /**@name 男 */
  Man = '1',
  /**@name 保密 */
  Secret = '2',
}

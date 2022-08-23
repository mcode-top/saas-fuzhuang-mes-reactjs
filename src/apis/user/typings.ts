/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-01 09:36:34
 * @Description: 用户接口传参类型
 */
export type LoginDTO = {
  username: string,
  password: string
}

export type UserInfo = {
  username: string,
  headImage: string,
  id: number,
  deptId: number,
  roleList: any[],
  name: string,
  phone: string,
  email: string,
  dept: any,
  [key: string]: any
}

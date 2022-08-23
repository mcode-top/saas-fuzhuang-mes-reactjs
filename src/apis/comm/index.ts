/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 20:16:59
 * 通用接口（涉及业务较广的）
 */
import { request } from "umi";
export type NameAndIdType = {
  name: string,
  id: number
}

export function getAllUsers() {
  return request<RESULT_SUCCESS<NameAndIdType[]>>("/user/users/all", {
    method: "GET"
  })
}
export function getAllRoles() {
  return request<RESULT_SUCCESS<NameAndIdType[]>>("/role/roles/all", {
    method: "GET"
  })
}
export function getAllDepts() {
  return request<RESULT_SUCCESS<NameAndIdType[]>>("/dept/depts/all", {
    method: "GET"
  })
}

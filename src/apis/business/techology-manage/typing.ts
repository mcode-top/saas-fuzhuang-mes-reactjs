import { BusMaterialTypeEnum } from "@/pages/business/techology-manage/Material/typing"

export type StationPageParamQuery = {
  name?: string,
  device?: string,
  remark?: string,
  createdAt?: Date[],
  updatedAt?: Date[],
}
export type WorkProcessPageParamQuery = {
  name?: string,
  remark?: string,
  createdAt?: Date[],
  updatedAt?: Date[],
}

export type WorkPricePageParamQuery = {
  name?: string,
  remark?: string,
  createdAt?: Date[],
  updatedAt?: Date[],
}

export type SizeTemplateItemPageParamQuery = {
  name?: string,
  remark?: string,
  parentId: number | undefined
  specification?: string
  createdAt?: Date[],
  updatedAt?: Date[],
}

export type MaterialPageParamQuery = {
  code?: string
  name?: string
  type?: BusMaterialTypeEnum
  unit?: string
  price?: number
  remark?: string
  createdAt?: Date[],
  updatedAt?: Date[],
}

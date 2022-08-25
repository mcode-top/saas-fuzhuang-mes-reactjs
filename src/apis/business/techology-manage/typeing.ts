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

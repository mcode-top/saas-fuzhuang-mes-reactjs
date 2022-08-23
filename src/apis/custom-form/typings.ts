/**@name 查询类型 */
export type CustomFormTableType = {
  /**@name 字段名 */
  field: string
  /**@name 列标题 */
  title: string
  /**@name 字段类型 */
  type?: CustomFormDataType
  /**@name 设置查询字段位置 一般用于关联查询 */
  position?: string
  /**@name 是否为数组 */
  array?: boolean
  /**@name 是否需要聚合 true 则 array_agg(field)*/
  agg?: boolean
  /**@name 搜索类型 */
  searchType?: CustomFormSearchType
  /**@name 是否隐藏查询 */
  hideInSearch?: boolean
  /**@name 是否排序 */
  sorter?: boolean
  /**@name 增强自定义查询条件 */
  expression?: string
  viewColumn: Record<string, any>
}

/**@name 自定义表单查询类型 like 模糊 eq 相等 manyTag 批量相等 range timeRange 范围查询 custom 自定义查询*/
export type CustomFormSearchType = "like" | "eq" | "manyTag" | "range" | "timeRange" | "custom"
/**@name 字段类型 如果涉及json查询请使用增强 void没有实际数据依赖其他实体数据*/
export type CustomFormDataType = "int" | "int8" | "float" | "boolean" | "text" | "date" | "timestamp" | "json"

/**@name 自定义表实体数据 */
export type CustomTableDataItem<T = any> = {
  data: T,
  id: number,
  operatorId: number,
  deptKey: string,
  roleLevel: number,
  version: string,
  parseVersion: string,
  createdAt: Date,
  updatedAt: Date
  result: T
}

/**@name 查询权限 */
export enum CustomFormQueryAuth {
  ONLY_DEPT_KEY = "DEPT_KEY", // 仅检查部门级别
  ONLY_ROLE_LEVEL = "ROLE_LEVEL",// 仅检查角色级别
  LEVEL = "LEVEL",// 检查部门角色及自己对比权限
  ALL = "ALL", //可以查询全部
  NOT = "NOT" //仅查询自己创建
}

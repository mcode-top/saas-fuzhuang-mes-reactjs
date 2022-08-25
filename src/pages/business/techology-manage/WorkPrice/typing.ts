import { BusStationType } from "../Station/typing"

/**@name 工价管理类型 */
export type BusWorkPriceType = {
  id?: number
  name: string
  data: BusWorkPriceItem[]
  remark?: string
}
/**@name 工价详细内容 */
export type BusWorkPriceItem = {
  id?: number
  /**@name 工序Id */
  workProcessId: string
  /**@name 工序名称 */
  name: string
  /**@name 工价 */
  price: number
}

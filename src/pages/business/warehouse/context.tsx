import type { BusWarehouseShelfType, BusWarehouseType } from '@/apis/business/warehouse/typing';
import type { SimpleColumnListRef } from '@/components/Comm/SimpleColumnList';
import type { ActionType } from '@ant-design/pro-table';
import React, { useState } from 'react';

/**@name 仓管管理实例 */
export type WarehouseContextType = {
  /**@name 当前选中的货架 */
  currentShelfNode?: BusWarehouseShelfType;
  setCurrentShelfNode?: React.Dispatch<React.SetStateAction<BusWarehouseShelfType | undefined>>;
  /**@name 当前选中的仓库 */
  currentWarehouse?: BusWarehouseType;
  setCurrentWarehouse?: React.Dispatch<React.SetStateAction<BusWarehouseType | undefined>>;
  /**@name 仓库列表控制变量 */
  warehouseAction?: React.MutableRefObject<ActionType | null>;
  /**@name 货架列表控制变量 */
  shelfAction?: React.MutableRefObject<SimpleColumnListRef | null>;
  /**@name 货品列表控制变量 */
  goodsAction?: React.MutableRefObject<ActionType | null>;
};
export const useDefaultWarehouse = () => {
  const [currentWarehouse, setCurrentWarehouse] = useState<BusWarehouseType | undefined>();
  const [currentShelfNode, setCurrentShelfNode] = useState<BusWarehouseShelfType | undefined>();

  return {
    currentWarehouse,
    setCurrentWarehouse,
    currentShelfNode,
    setCurrentShelfNode,
    shelfAction: React.createRef<SimpleColumnListRef>(),
    goodsAction: React.createRef<ActionType>(),
    warehouseAction: React.createRef<ActionType>(),
  };
};

export const WarehouseContext = React.createContext<WarehouseContextType>({});

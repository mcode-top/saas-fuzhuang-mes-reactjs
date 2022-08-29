import type { BusWarehouseShelfType, BusWarehouseType } from '@/apis/business/warehouse/typing';
import type { SimpleColumnListRef } from '@/components/Comm/SimpleColumnList';
import type { ActionType } from '@ant-design/pro-table';
import React, { useState } from 'react';

export type WarehouseContextType = {
  currentShelfNode?: BusWarehouseShelfType;
  setCurrentShelfNode?: React.Dispatch<React.SetStateAction<BusWarehouseShelfType | undefined>>;
  currentWarehouse?: BusWarehouseType;
  setCurrentWarehouse?: React.Dispatch<React.SetStateAction<BusWarehouseType | undefined>>;
  warehouseAction?: React.MutableRefObject<ActionType | null>;
  shelfAction?: React.MutableRefObject<SimpleColumnListRef | null>;
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

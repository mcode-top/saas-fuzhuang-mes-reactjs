import { fetchWorkStaffList } from '@/apis/business/techology-manage/work-process';
import type { BusWarehouseType, BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import { STORAGE_WAREHOUSE_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';

/**@name 选择仓库 */
const BusSelectWarehouse: React.FC<ProFormSelectProps & { type?: BusWarehouseTypeEnum }> = (
  props,
) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      readonly={props.readonly}
      request={async (params) => {
        const result: BusWarehouseType[] = (
          await storageDataSource.getValue(STORAGE_WAREHOUSE_LIST)
        ).data;
        return result
          .filter((i) => {
            if (props.type) {
              return i.type === props.type;
            }
            return true;
          })
          .map((i) => {
            return {
              label: i.name,
              value: i.id,
            };
          });
      }}
    />
  );
};
export default BusSelectWarehouse;

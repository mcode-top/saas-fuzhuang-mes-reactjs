import { fetchWorkStaffList } from '@/apis/business/techology-manage/work-process';
import { STORAGE_WAREHOUSE_SHLEF_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';

/**@name 选择仓库下的货架 */
const BusSelectWarehouseShelf: React.FC<ProFormSelectProps & { warehouseId: number }> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      readonly={props.warehouseId === undefined || props.readonly}
      params={{ warehouseId: props.warehouseId }}
      request={async (params) => {
        if (params.warehouseId === undefined) {
          return [];
        }
        return arrayAttributeChange(
          (
            await storageDataSource.getValue(
              STORAGE_WAREHOUSE_SHLEF_LIST,
              undefined,
              params.warehouseId,
            )
          ).data,
          [
            ['id', 'value'],
            ['name', 'label'],
          ],
        );
      }}
    />
  );
};
export default BusSelectWarehouseShelf;

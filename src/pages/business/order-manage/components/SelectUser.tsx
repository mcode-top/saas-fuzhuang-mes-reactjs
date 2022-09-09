import { STORAGE_USER_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';

/**@name 选择系统人员 */
const BusSelectUser: React.FC<ProFormSelectProps> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      request={async () => {
        return arrayAttributeChange((await storageDataSource.getValue(STORAGE_USER_LIST)).data, [
          ['id', 'value'],
          ['name', 'label'],
        ]);
      }}
    />
  );
};
export default BusSelectUser;

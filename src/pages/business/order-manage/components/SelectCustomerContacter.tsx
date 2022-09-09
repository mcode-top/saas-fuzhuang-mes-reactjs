import type { BusCustomerContacterType } from '@/apis/business/customer/typing';
import { STORAGE_CUSTOMER_CONTACTER_LIST, STORAGE_USER_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';

/**@name 选择客户联系人 */
const BusSelectCustomerContacter: React.FC<ProFormSelectProps & { companyId?: number }> = (
  props,
) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      help={
        props.companyId ? undefined : '需要先选择公司,如果公司联系人不存在则需要先去客户管理创建'
      }
      params={{ companyId: props.companyId }}
      request={async (params) => {
        if (params.companyId === undefined) {
          return [];
        }
        return arrayAttributeChange(
          (
            await storageDataSource.getValue(
              STORAGE_CUSTOMER_CONTACTER_LIST,
              false,
              params.companyId,
            )
          ).data,
          [
            ['id', 'value'],
            [
              (value: BusCustomerContacterType) => {
                return `${value.name}(${value.phone})`;
              },
              'label',
            ],
          ],
        );
      }}
    />
  );
};
export default BusSelectCustomerContacter;

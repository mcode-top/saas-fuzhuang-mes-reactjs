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
  let hlepText = '';
  if (!props.readonly) {
    if (!props.companyId) {
      hlepText = '需要先选择公司';
    }
  }
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      help={hlepText}
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

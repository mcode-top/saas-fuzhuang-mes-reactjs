import type { BusCustomerCompanyType } from '@/apis/business/customer/typing';
import { CustomerCompanyValueEnum, dictValueEnum } from '@/configs/commValueEnum';
import { STORAGE_CUSTOMER_COMPANY_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';

/**@name 选择客户公司 */
const BusSelectCustomerCompany: React.FC<ProFormSelectProps> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      help={'如果公司不存在则需要先去客户管理创建'}
      request={async () => {
        return arrayAttributeChange(
          (await storageDataSource.getValue(STORAGE_CUSTOMER_COMPANY_LIST)).data,
          [
            ['id', 'value'],
            [
              (value: BusCustomerCompanyType) =>
                `(${dictValueEnum(CustomerCompanyValueEnum.Type, value.type)})${value.name}`,
              'label',
            ],
          ],
        );
      }}
    />
  );
};
export default BusSelectCustomerCompany;

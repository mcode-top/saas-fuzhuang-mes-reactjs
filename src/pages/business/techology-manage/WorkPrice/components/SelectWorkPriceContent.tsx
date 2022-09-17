import { STORAGE_WORK_PRICE_CONTENT, STORAGE_WORK_PRICE_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import React from 'react';

const SelectWorkPriceContent: React.FC<
  ProFormSelectProps & {
    /**@name 工价id */
    workPriceId: number;
    onChangePrice?: (value: number, price: number) => void;
  }
> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
        showSearch: true,
        onChange: (value, option) => {
          if (!Array.isArray(option) && option) {
            const price = /(?<=\()\S+(?=\))/g.exec(option.label as string)?.[0];
            props?.onChangePrice?.(value, Number(price));
          }
          props.fieldProps?.onChange?.(value, option);
        },
      }}
      params={{ priceId: props.workPriceId }}
      request={async (params) => {
        return arrayAttributeChange(
          (await storageDataSource.getValue(STORAGE_WORK_PRICE_CONTENT, false, params.priceId))
            .data,
          [
            ['workProcessId', 'value'],
            [
              (data) => {
                return `${data.name}(${data.price})`;
              },
              'label',
            ],
          ],
        );
      }}
    />
  );
};

export default SelectWorkPriceContent;

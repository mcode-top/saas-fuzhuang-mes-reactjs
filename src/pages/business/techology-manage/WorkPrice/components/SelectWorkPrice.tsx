import { STORAGE_WORK_PRICE_LIST } from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import React from 'react';

const SelectWorkPrice: React.FC<ProFormSelectProps> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
      }}
      request={async (params) => {
        return arrayAttributeChange(
          (await storageDataSource.getValue(STORAGE_WORK_PRICE_LIST, false)).data,
          [
            ['id', 'value'],
            ['name', 'label'],
          ],
        );
      }}
    />
  );
};

export default SelectWorkPrice;

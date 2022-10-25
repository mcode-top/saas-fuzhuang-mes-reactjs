import {
  STORAGE_MATERIAL_LIST,
  STORAGE_UNDONE_CONTRACT_NUMBER_LIST,
} from '@/configs/storage.config';
import { arrayAttributeChange } from '@/utils';
import storageDataSource from '@/utils/storage';
import type { CaptFieldRef } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import { throttle } from 'lodash';
import React from 'react';

/**@name 选择未完成的合同单 */
const SelectUndoneContractSelect: React.FC<
  ProFormSelectProps & {
    multiple?: boolean;
  }
> = (props) => {
  return (
    <ProFormSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
        mode: props?.multiple ? 'multiple' : undefined,
        showSearch: true,
      }}
      request={async (params: { keyWords: string | undefined }) => {
        return (await getList(params.keyWords)) as any;
      }}
    />
  );
};

const getList = throttle(
  async function (keyWords) {
    return arrayAttributeChange(
      (
        await storageDataSource.getValue(STORAGE_UNDONE_CONTRACT_NUMBER_LIST, true, {
          partContractNumber: keyWords,
        })
      ).data,
      [
        ['contractNumber', 'value'],
        ['contractNumber', 'label'],
      ],
    );
  },
  1000,
  { leading: true },
);

export default SelectUndoneContractSelect;

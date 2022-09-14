import { STORAGE_SIZE_TEMPLATE_TREE } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import { ProFormTreeSelect } from '@ant-design/pro-form';
import type {
  ProFormFieldItemProps,
  ProFormFieldRemoteProps,
} from '@ant-design/pro-form/lib/interface';
import type { RefSelectProps, TreeSelectProps } from 'antd';
import React from 'react';

const SelectTreeSizeTemplate: React.FC<
  ProFormFieldItemProps<TreeSelectProps<any>, RefSelectProps> & ProFormFieldRemoteProps
> = (props) => {
  return (
    <ProFormTreeSelect
      {...props}
      fieldProps={{
        ...props.fieldProps,
        treeDefaultExpandAll: true,
      }}
      request={async () => {
        const { data, titleParentTree } = await storageDataSource.getValue(
          STORAGE_SIZE_TEMPLATE_TREE,
          false,
        );
        return titleParentTree.map((i) => ({ ...i, disabled: true }));
      }}
    />
  );
};

export default SelectTreeSizeTemplate;

import {
  fetchCreateSizeTemplateItem,
  fetchUpdateSizeTemplateItem,
} from '@/apis/business/techology-manage/size-template';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { useRef } from 'react';
import type { BusSizeTemplateItemType } from './typing';

const SizeTemplateItemTableModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusSizeTemplateItemType;
  };
  title: string;
  selectId: number;
  onFinish?: (value: BusSizeTemplateItemType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = { ...(await formRef.current?.validateFields()), parentId: props.selectId };

        if (props.node.type === 'create') {
          await fetchCreateSizeTemplateItem(value);
        } else if (props.node.type === 'update') {
          console.log(value);

          await fetchUpdateSizeTemplateItem({
            ...(props.node?.value || {}),
            ...value,
            parentId: props.node?.value?.parentId,
          });
        }
        props?.onFinish?.(value);
        resolve(true);
      } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        reject(false);
      }
    });
  }
  const disabled = props.node.type === 'watch';
  return (
    <ModalForm<BusSizeTemplateItemType>
      width={500}
      title={props.title}
      formRef={formRef}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(props.node.value);
      }}
      trigger={props.children}
      onFinish={onFinish}
    >
      <ProFormText label="尺码名称" disabled={disabled} rules={[{ required: true }]} name="name" />
      <ProFormText
        label="尺码规格"
        disabled={disabled}
        rules={[{ required: true }]}
        name="specification"
      />
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default SizeTemplateItemTableModal;

import {
  fetchCreateSizeTemplateParent,
  fetchUpdateSizeTemplateParent,
} from '@/apis/business/techology-manage/size-template';
import SelectSystemPersonButton from '@/components/Comm/FormlyComponents/SelectSystemPersonButton';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { pick } from 'lodash';
import { useRef } from 'react';
import type { BusSizeTemplateParentType } from './typing';

const SizeTemplateParentListModal: React.FC<{
  node: {
    type: 'create' | 'update' | 'watch';
    value?: BusSizeTemplateParentType;
  };
  title: string;
  onFinish?: (value: BusSizeTemplateParentType) => void;
  children: JSX.Element;
}> = (props) => {
  const formRef = useRef<ProFormInstance>();

  function onFinish(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await formRef.current?.validateFields();

        if (props.node.type === 'create') {
          await fetchCreateSizeTemplateParent(value);
        } else if (props.node.type === 'update') {
          await fetchUpdateSizeTemplateParent({
            ...(pick(props.node?.value, 'name', 'id', 'remark') || {}),
            ...value,
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
    <ModalForm<BusSizeTemplateParentType>
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
      <ProFormTextArea label="备注信息" disabled={disabled} name="remark" />
    </ModalForm>
  );
};
export default SizeTemplateParentListModal;

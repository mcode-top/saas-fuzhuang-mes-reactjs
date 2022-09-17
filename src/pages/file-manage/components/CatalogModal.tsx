import {
  createMyCatalog,
  createOrganizationCatalog,
  fetchMyCatalogTree,
  updateFileOrCatalogBasic,
} from '@/apis/file-manage/file-manage';
import type { FileManageOpeartionCatalogDto } from '@/apis/file-manage/typings';
import { FileManageCatalogItem, FileManageModeEnum } from '@/apis/file-manage/typings';
import { traverseTree } from '@/utils';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-form';
import { Button } from 'antd';
import { omit } from 'lodash';
import { useEffect, useRef } from 'react';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:57:23
 * 创建目录
 */
export default function CatalogModal(props: {
  node: {
    type: 'create' | 'update';
    param: Partial<FileManageOpeartionCatalogDto>;
  };
  children: JSX.Element;
  title: string;
  parentId: number;
  mode: FileManageModeEnum;
  onFinish?: (values: FileManageOpeartionCatalogDto) => void;
}) {
  const formRef = useRef<ProFormInstance>();

  return (
    <ModalForm<FileManageOpeartionCatalogDto>
      width={500}
      title={props.title}
      trigger={props.children}
      formRef={formRef}
      initialValues={props.node.param}
      onVisibleChange={(v) => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(props.node.param);
      }}
      onFinish={(formValue): Promise<boolean> => {
        const values = Object.assign(formValue, { parentId: props.parentId });
        return new Promise((resolve, reject) => {
          let promiseCatalog;
          if (props.node.type === 'create') {
            promiseCatalog =
              props.mode !== FileManageModeEnum.Organization
                ? createMyCatalog(values)
                : createOrganizationCatalog(values);
          } else {
            promiseCatalog = updateFileOrCatalogBasic(
              props.node.param.id as number,
              omit(values, ['parentId']),
            );
          }

          promiseCatalog
            .then(() => {
              props?.onFinish?.(values);
              resolve(true);
            })
            .catch(() => reject(false));
        });
      }}
    >
      <ProFormText label="目录名" rules={[{ required: true }]} name="name" />
      <ProFormTextArea label="描述" name="description" />
    </ModalForm>
  );
}

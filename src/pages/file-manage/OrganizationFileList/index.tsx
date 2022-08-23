/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:05:43
 * 我的文件目录
 */
import type { FileManageOrganizationFileItem } from '@/apis/file-manage/typings';
import { FileManageModeEnum } from '@/apis/file-manage/typings';
import { fetchOrganizationFilePage } from '@/apis/file-manage/file-manage';
import FileManageList from '../components/FileList';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { Button, Menu } from 'antd';
import SettingFileAuthGroup from '../components/SettingFileAuthGroup';
import { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';

export default function OrganizationFileList() {
  const tableRef = useRef<ActionType>();
  return (
    <FileManageList<FileManageOrganizationFileItem>
      request={fetchOrganizationFilePage}
      tableRef={tableRef}
      showCreateCatalog
      showOpertion
      showUploadFile
      otherOpertionDom={[
        (record) => {
          return (
            <SettingFileAuthGroup
              fileId={record.id}
              key="设置权限"
              onFinish={() => {
                tableRef.current?.reload?.();
              }}
            >
              <Menu.Item key="设置权限">设置权限</Menu.Item>
            </SettingFileAuthGroup>
          );
        },
      ]}
      mode={FileManageModeEnum.Organization}
    />
  );
}

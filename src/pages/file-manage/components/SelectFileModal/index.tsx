/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 09:59:30
 */

import { fetchMyFilePage, fetchOrganizationFilePage } from '@/apis/file-manage/file-manage';
import type {
  FileManageFileItem,
  FileManageOrganizationFileItem,
} from '@/apis/file-manage/typings';
import {
  FileManageAuthModeEnum,
  FileManageModeEnum,
  FileManageTypeEnum,
} from '@/apis/file-manage/typings';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { Alert, Menu, message, Modal, Table, Tabs } from 'antd';
import { useRef, useState } from 'react';
import type { FileManageListRef, FileManageSelectFileMode } from '../FileList';
import FileManageList from '../FileList';
export type IFileList = { name: string; position?: string }[];

export type SelectFileType = {
  /**@name 是否多选 */
  multiple?: boolean;
  type?: FileManageSelectFileMode;
  /**@name 是否显示创建文件夹 */
  showCreateCatalog?: boolean;
  /**@name 是否显示上传文件 */
  showUploadFile?: boolean;
  /**@name 是否显示组织文件列表 */
  showOrganizationFileList?: boolean;
  /**@name 是否显示我的文件列表 */
  showMyFileList?: boolean;
  title?: string;
  children: JSX.Element;
  /**@name 设置可选择:默认true */
  showSelect?: boolean;
  /**@name 设置选择的文件key失效 */
  disabledKeys?: number[];
  /**@name  设置可进入的目录失效*/
  disabledEnterCatalog?: number[];
  onFinish?: (values: {
    fileIds: number[];
    toCatalogId: number;
    toCatalogMode: FileManageModeEnum;
    fileList: IFileList;
  }) => any;
};
export default function SelectFileModal(props: SelectFileType) {
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState<string>(
    props.showOrganizationFileList !== false
      ? FileManageModeEnum.Organization.toString()
      : FileManageModeEnum.Personage.toString(),
  );

  const [selectMyValues, setSelectMyValues] = useState<{ key: number; row: FileManageFileItem }[]>(
    [],
  );
  const [selectOrganizationValues, setSelectOrganizationValues] = useState<
    { key: number; row: FileManageOrganizationFileItem }[]
  >([]);
  /**@name 当前目录ID */
  const [selectMyCatalogId, setSelectMyCatalogId] = useState<number>(0);
  const [organizationCatalogId, setSelectOrganizationCatalogId] = useState<number>(0);
  /**@name 个人文件表格Ref对应 */
  const myFileRef = useRef<FileManageListRef>();
  /**@name 组织文件表格Ref对应 */
  const organizationFileRef = useRef<FileManageListRef>();
  async function handleFinish() {
    if (props?.onFinish) {
      const currentCatalog =
        tabKey === FileManageModeEnum.Personage.toString()
          ? selectMyCatalogId
          : organizationCatalogId;
      if (props.showSelect === false && currentCatalog === -1) {
        message.warning('无法选择[全部目录]');
      }
      const fileIds: number[] = [];
      const fileList: IFileList = [];
      [...selectMyValues, ...selectOrganizationValues].forEach((item) => {
        fileIds.push(item.key);
        fileList.push({ name: item.row.name, position: item.row.position });
      });
      await props.onFinish({
        fileIds,
        fileList,
        toCatalogId: currentCatalog,
        toCatalogMode: tabKey as FileManageModeEnum,
      });
    }
    closeModal();
  }
  function closeModal() {
    myFileRef.current?.clearSelected?.();
    organizationFileRef.current?.clearSelected?.();
    setSelectMyValues([]);
    setSelectOrganizationValues([]);
    setVisible(false);
  }
  function filePage(fuc) {
    return (param) => {
      if (props.type === 'catalog') {
        return fuc({
          ...param,
          query: { ...(param.query || {}), type: FileManageTypeEnum.Catalog },
        });
      }
      return fuc(param);
    };
  }
  return (
    <>
      <Modal
        width={1200}
        visible={visible}
        title={props?.title || '选择系统文件'}
        onOk={handleFinish}
        onCancel={closeModal}
        maskClosable={false}
        keyboard={false}
      >
        <Alert message={`已选择${selectMyValues.length + selectOrganizationValues.length}项`} />
        <Tabs activeKey={tabKey} onChange={setTabKey}>
          {props.showMyFileList !== false ? (
            <Tabs.TabPane tab="个人文件" key={FileManageModeEnum.Personage.toString()}>
              <FileManageList
                tableRef={myFileRef}
                showSelect={props.showSelect}
                multiple={props.multiple || false}
                selectMode={props.type}
                request={filePage(fetchMyFilePage)}
                mode={FileManageModeEnum.Personage}
                disabledKeys={props.disabledKeys}
                disabledEnterCatalog={props.disabledEnterCatalog}
                onEnterCatalog={setSelectMyCatalogId}
                onSelectKeys={(keys, rows) => {
                  setSelectMyValues(keys.map((key, i) => ({ key, row: rows[i] })));
                  if (!props.multiple && keys.length > 0) {
                    setSelectOrganizationValues([]);
                    organizationFileRef.current?.setSelectKeys?.([]);
                  }
                }}
              />
            </Tabs.TabPane>
          ) : null}
          {props.showOrganizationFileList !== false ? (
            <Tabs.TabPane tab="组织文件" key={FileManageModeEnum.Organization.toString()}>
              <FileManageList
                tableRef={organizationFileRef}
                selectMode={props.type}
                multiple={props.multiple || false}
                request={filePage(fetchOrganizationFilePage)}
                showSelect={props.showSelect}
                disabledKeys={props.disabledKeys}
                disabledEnterCatalog={props.disabledEnterCatalog}
                onEnterCatalog={setSelectOrganizationCatalogId}
                onSelectKeys={(keys, rows) => {
                  setSelectOrganizationValues(keys.map((key, i) => ({ key, row: rows[i] })));
                  if (!props.multiple && keys.length > 0) {
                    setSelectMyValues([]);
                    myFileRef.current?.setSelectKeys?.([]);
                  }
                }}
                mode={FileManageModeEnum.Organization}
              />
            </Tabs.TabPane>
          ) : null}
        </Tabs>
      </Modal>
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        {props.children}
      </div>
    </>
  );
}

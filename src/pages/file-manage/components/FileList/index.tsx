/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:05:43
 * 我的文件目录
 */
import type { MutableRefObject } from 'react';
import type react from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {
  FileManageFileAuthGroup,
  FileManageFileItem,
  FileManageOrganizationFileItem,
} from '@/apis/file-manage/typings';
import { FileManageAuthModeEnum } from '@/apis/file-manage/typings';
import { FileManageModeEnum, FileManageTypeEnum } from '@/apis/file-manage/typings';
import { FolderOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, List, Menu, message, Modal, Space, Spin, Table, Tooltip } from 'antd';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import {
  copyManyFileOrCatalog,
  fetchOrganizationFileToAuthGroup,
  getOssFileIdToTimeLink,
  moveManyFileOrCatalog,
  removeManyFileOrCatalog,
} from '@/apis/file-manage/file-manage';
import CatalogBreadcrumb from '../CatalogBreadcrumb';
import { COM_PRO_TABLE_TIME } from '@/configs/index.config';
import { transformFileSize } from '../../file-manage.utils';
import UploadReviewListModal from '../UploadFileModal';
import CatalogModal from '../CatalogModal';
import SelectFileModal from '../SelectFileModal';
import { Access, useAccess } from 'umi';
import { downloadAction, downloadSystemFile } from '@/utils/upload/upload';
import { omit } from 'lodash';
export type FileManageSelectFileMode = 'all' | 'file' | 'catalog';
export type FileManageListRef = ActionType & { setSelectKeys: (keys: number[]) => void };
export default function FileManageList<
  T extends FileManageFileItem = FileManageOrganizationFileItem,
>(props: {
  request: (data: PAGINATION_QUERY.Param) => Promise<RESULT_SUCCESS<PAGINATION_QUERY.Result<T>>>;
  otherColumns?: ProColumns[];
  mode: FileManageModeEnum;
  /**@name 显示操作栏 */
  showOpertion?: boolean;
  multiple?: boolean;
  /**@name 显示创建文件夹 */
  showCreateCatalog?: boolean;
  /**@name 显示上传文件 */
  showUploadFile?: boolean;
  /**@name 显示选择框 */
  showSelect?: boolean;
  /**@name 选择文件类型 */
  selectMode?: FileManageSelectFileMode;
  tableRef?: MutableRefObject<ActionType | undefined>;
  /**@name 设置其他操作元素 */
  otherOpertionDom?: ((record: T) => JSX.Element)[];
  /**@name 设置选择的文件key失效 */
  disabledKeys?: number[];
  /**@name  设置可进入的目录失效*/
  disabledEnterCatalog?: number[];
  onSelectKeys?: (keys: number[], rows: T[]) => any;
  onEnterCatalog?: (catalogId: number) => any;
}) {
  const access = useAccess();
  const [parentPath, setParentPath] = useState([]);
  const [currentCatalogId, setCurrentCatalogId] = useState<number>(0);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  /**选择的ID */
  const [selectKeys, setSelectKeys] = useState<number[]>([]);
  /**选中的实体数据 */
  const [selectRows, setSelectRows] = useState<T[]>([]);
  // TODO:当前目录权限。。。
  const [currentCatalogAuth, setCurrentCatalogAuth] = useState<FileManageFileAuthGroup[]>([]);
  const tableRef = useRef<FileManageListRef>();
  useEffect(() => {
    enterCatalog(0);
  }, []);
  useEffect(() => {
    props.onSelectKeys?.(selectKeys, selectRows);
  }, [selectKeys]);
  useImperativeHandle(props?.tableRef, () => {
    if (tableRef.current) {
      return { ...(tableRef.current || {}), setSelectKeys };
    }
  });
  useEffect(() => {
    props.onEnterCatalog?.(currentCatalogId);
  }, [currentCatalogId]);
  function enterCatalog(id: number, isReload = true) {
    setTableLoading(true);
    fetchOrganizationFileToAuthGroup(id)
      .then((res) => {
        setCurrentCatalogAuth(res.data);
        setCurrentCatalogId(id);
        if (isReload) {
          tableRef.current?.reload?.();
        }
      })
      .finally(() => {
        setTableLoading(false);
      });
  }
  function handleRemoveMany(ids: number[]) {
    Modal.confirm({
      title: '文件删除提示',
      content: `如果被删除的文件含有目录将会连同子目录一起删除，您确定要将[${ids.length}]文件删除吗？`,
      onOk: () => {
        return removeManyFileOrCatalog(ids).then((res) => {
          message.success('删除成功');
          tableRef.current?.reloadAndRest?.();
        });
      },
    });
  }
  async function handleCopyMany(catalogId: number, catalogMode: FileManageModeEnum) {
    if (selectKeys.includes(catalogId)) {
      message.warning('复制到的目录不能是自己的');
      throw new Error('复制到的目录不能是自己的');
    }
    return await copyManyFileOrCatalog(selectKeys, catalogId, catalogMode).then((res) =>
      tableRef.current?.reloadAndRest?.(),
    );
  }
  async function handleMoveMany(catalogId: number, catalogMode: FileManageModeEnum) {
    if (selectKeys.includes(catalogId)) {
      message.warning('移动到的目录不能是自己的');
      throw new Error('移动到的目录不能是自己的');
    }
    return await moveManyFileOrCatalog(selectKeys, catalogId, catalogMode).then((res) =>
      tableRef.current?.reloadAndRest?.(),
    );
  }

  const columns: ProColumns<T>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (dom, record, index) => {
        if (record.type === FileManageTypeEnum.Catalog) {
          if (props?.disabledEnterCatalog?.includes(record.id) === true) {
            return (
              <Tooltip title="当前目录无法被选中">
                <Button
                  icon={<FolderOutlined style={{ fontSize: 20, color: '#219de6' }} />}
                  type="text"
                >
                  {record.name}
                </Button>
              </Tooltip>
            );
          } else {
            return (
              <Button
                onClick={() => enterCatalog(record.id)}
                icon={<FolderOutlined style={{ fontSize: 20, color: '#219de6' }} />}
                type="link"
              >
                {record.name}
              </Button>
            );
          }
        } else {
          return record.name;
        }
      },
    },
    {
      title: '描述',
      ellipsis: true,
      dataIndex: 'description',
    },
    {
      title: '大小',
      width: 150,
      dataIndex: 'size',
      hideInSearch: true,
      render: (dom, record) => {
        if (record.type === FileManageTypeEnum.Catalog) {
          return null;
        } else {
          return transformFileSize(record.size);
        }
      },
    },
    ...COM_PRO_TABLE_TIME.createdAt,
    ...(props?.otherColumns || []),
    ...(props.showOpertion
      ? [
          {
            title: '操作',
            fixed: 'right',
            width: 150,
            hideInSearch: true,
            key: 'operation',
            render: (dom, record, index) => {
              const other =
                props?.otherOpertionDom?.map((d) => {
                  return d(record);
                }) || [];
              return (
                <Dropdown
                  key="Dropdown"
                  trigger={['click']}
                  overlay={
                    <Menu key="menu">
                      {/* <Access
                        accessible={access.checkFileManage(
                          record?.authGroup,
                          FileManageAuthModeEnum.Review,
                          props.mode,
                        )}
                      >
                        <Menu.Item eventKey="review">预览文件(未开发)</Menu.Item>
                      </Access>
                       */}
                      <Access
                        accessible={
                          record.type === FileManageTypeEnum.File &&
                          access.checkFileManage(
                            record?.authGroup,
                            FileManageAuthModeEnum.ReviewAndDownload,
                            props.mode,
                          )
                        }
                      >
                        <Menu.Item
                          eventKey="download"
                          onClick={() => downloadSystemFile(record.id)}
                        >
                          下载文件
                        </Menu.Item>
                      </Access>
                      <Access
                        accessible={access.checkFileManage(
                          record?.authGroup,
                          FileManageAuthModeEnum.ReviewAndDownloadAndEdit,
                          props.mode,
                        )}
                      >
                        <CatalogModal
                          title="修改文件信息"
                          parentId={currentCatalogId}
                          mode={props.mode}
                          node={{ type: 'update', param: { ...record } }}
                          onFinish={() => {
                            tableRef.current?.reloadAndRest?.();
                          }}
                        >
                          <Menu.Item eventKey="update">修改文件信息</Menu.Item>
                        </CatalogModal>
                      </Access>
                      {other}
                    </Menu>
                  }
                >
                  <Button icon={<SettingOutlined />} type="link">
                    更多操作
                  </Button>
                </Dropdown>
              );
            },
          },
        ]
      : []),
  ];
  return (
    <Spin spinning={tableLoading}>
      <ProTable<T>
        onLoadingChange={() => {
          setSelectKeys([]);
        }}
        columns={columns}
        rowKey="id"
        rowSelection={
          props.showSelect === false
            ? false
            : {
                // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                // 注释该行则默认不显示下拉选项
                selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                defaultSelectedRowKeys: [],
                selectedRowKeys: selectKeys,
                onChange(selectedRowKeys: react.Key[], selectedRows: T[]): void {
                  setSelectKeys(selectedRowKeys as number[]);
                  setSelectRows(selectedRows);
                },
                type: props.multiple === false ? 'radio' : 'checkbox',
                getCheckboxProps: (record) => {
                  let disabled = false;
                  if (props?.selectMode === 'catalog') {
                    disabled = record.type === FileManageTypeEnum.File ? true : false;
                  } else if (props?.selectMode === 'file') {
                    disabled = record.type === FileManageTypeEnum.Catalog ? true : false;
                  }
                  if (props?.disabledKeys) {
                    disabled = props.disabledKeys.includes(record.id);
                  }
                  return {
                    disabled, // Column configuration not to be checked
                    name: record.name,
                  };
                },
              }
        }
        headerTitle={
          <CatalogBreadcrumb onChange={enterCatalog} loading={tableLoading} list={parentPath} />
        }
        tableAlertOptionRender={
          props.showOpertion
            ? ({ selectedRowKeys }) => {
                return (
                  <Access
                    accessible={access.checkFileManage(
                      currentCatalogAuth,
                      FileManageAuthModeEnum.ReviewAndDownloadAndEdit,
                      props.mode,
                    )}
                  >
                    <Space size={16}>
                      <SelectFileModal
                        type="catalog"
                        showOrganizationFileList={props.mode === FileManageModeEnum.Organization}
                        showMyFileList={props.mode === FileManageModeEnum.Personage}
                        disabledKeys={selectedRowKeys as number[]}
                        disabledEnterCatalog={selectedRowKeys as number[]}
                        showSelect={false}
                        onFinish={async ({ fileIds, toCatalogId, toCatalogMode }) => {
                          await handleMoveMany(toCatalogId, toCatalogMode);
                        }}
                      >
                        <Button>批量移动</Button>
                      </SelectFileModal>
                      <SelectFileModal
                        type="catalog"
                        disabledKeys={selectedRowKeys as number[]}
                        showSelect={false}
                        disabledEnterCatalog={selectedRowKeys as number[]}
                        onFinish={async ({ fileIds, toCatalogId, toCatalogMode }) => {
                          await handleCopyMany(toCatalogId, toCatalogMode);
                        }}
                      >
                        <Button>批量复制</Button>
                      </SelectFileModal>
                      <Button onClick={() => handleRemoveMany(selectedRowKeys as number[])} danger>
                        批量删除
                      </Button>
                    </Space>
                  </Access>
                );
              }
            : undefined
        }
        beforeSearchSubmit={(values) => {
          console.log(Object.keys(values).length, values, 'Object.keys(values).length');

          if (Object.keys(omit(values, ['current', 'pageSize', '_timestamp'])).length > 0) {
            enterCatalog(-1, false);
            return { ...values, parentId: -1 };
          }
          return values;
        }}
        actionRef={tableRef}
        onReset={() => {
          enterCatalog(0);
        }}
        search={{
          filterType: 'light',
        }}
        toolBarRender={() => {
          return [
            <Access
              key="CatalogModal"
              accessible={
                access.checkFileManage(
                  currentCatalogAuth,
                  FileManageAuthModeEnum.ReviewAndDownloadAndEdit,
                  props.mode,
                ) &&
                props.showCreateCatalog === true &&
                currentCatalogId !== -1
              }
            >
              <CatalogModal
                title="新增目录"
                key="createCatalog"
                mode={props.mode}
                parentId={currentCatalogId}
                node={{ type: 'create', param: {} }}
                onFinish={() => {
                  tableRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="primary">新增目录</Button>
              </CatalogModal>
            </Access>,
            <Access
              key="UploadReviewListModal"
              accessible={
                access.checkFileManage(
                  currentCatalogAuth,
                  FileManageAuthModeEnum.ReviewAndDownloadAndEdit,
                  props.mode,
                ) &&
                props.showUploadFile === true &&
                currentCatalogId !== -1
              }
            >
              <UploadReviewListModal
                parentId={currentCatalogId}
                multiple={true}
                mode={props.mode}
                onFinish={() => {
                  tableRef.current?.reloadAndRest?.();
                }}
              >
                <Button type="primary" key="uploadFile">
                  上传新文件
                </Button>
              </UploadReviewListModal>
            </Access>,
          ];
        }}
        request={async (params, sort, filter) => {
          return nestPaginationTable(
            { ...params, parentId: currentCatalogId },
            sort,
            filter,
            props.request,
          ).then((res: any) => {
            setParentPath(res.parentPath);
            return res;
          });
        }}
      />
    </Spin>
  );
}

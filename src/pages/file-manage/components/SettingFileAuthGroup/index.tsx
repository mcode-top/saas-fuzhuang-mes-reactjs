/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 19:12:31
 * 设置文件权限
 */

import type { FileManageFileAuthGroup } from '@/apis/file-manage/typings';
import { FileManageAuthModeEnum } from '@/apis/file-manage/typings';
import SelectSystemPerson from '@/components/SelectSystemPerson';
import { PlusOutlined } from '@ant-design/icons';
import ProCard, { CheckCard } from '@ant-design/pro-card';
import { Avatar, Button, Col, Modal, Row, Select, Comment, Space } from 'antd';
import type { ReactText } from 'react';
import { useEffect, useState } from 'react';
import ProList from '@ant-design/pro-list';
import styles from './index.less';
import { STORAGE_DEPT_LIST, STORAGE_ROLE_LIST, STORAGE_USER_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import { jsonUniq } from '@/utils';
import { forEach, isEmpty } from 'lodash';
import {
  fetchOrganizationFileToAuthGroup,
  updateOranizationFileAuthGroup,
} from '@/apis/file-manage/file-manage';

type SelectGroup = {
  title: string;
  value: number;
  type: 'user' | 'role' | 'dept';
  mode: FileManageAuthModeEnum;
  key: string;
};
export default function SettingFileAuthGroup(props: {
  fileId: number;
  onFinish?: () => void;
  children: JSX.Element;
}) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SelectGroup[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: ReactText[]) => setSelectedRowKeys(keys),
  };

  useEffect(() => {
    if (visible) {
      setSelectedRowKeys([]);
      setLoading(true);
      const cacheData: SelectGroup[] = [];
      fetchOrganizationFileToAuthGroup(props.fileId)
        .then((res) => {
          Promise.all(
            res.data.map(async (item) => {
              cacheData.push(...(await formatAuthGroupToSelectGroup(item)));
            }),
          )
            .then(() => {
              setDataSource(cacheData);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((err) => {
          console.error(err);

          setLoading(false);
        });
    }
  }, [visible]);
  async function handleFinish() {
    const modes: Record<number, FileManageFileAuthGroup> = {};
    dataSource.forEach((item) => {
      if (!modes[item.mode]) {
        modes[item.mode] = {
          userIds: [],
          roleIds: [],
          deptIds: [],
          mode: item.mode,
        };
      }
      if (item.type === 'user') {
        modes[item.mode]?.userIds?.push(item.value);
      }
      if (item.type === 'role') {
        modes[item.mode]?.roleIds?.push(item.value);
      }
      if (item.type === 'dept') {
        modes[item.mode]?.deptIds?.push(item.value);
      }
    });
    setLoading(true);
    await updateOranizationFileAuthGroup(
      props.fileId,
      Object.keys(modes).map<FileManageFileAuthGroup>((key) => modes[key]),
    ).finally(() => {
      setLoading(false);
    });
    if (props?.onFinish) {
      props.onFinish();
    }
    setDataSource([]);
    setSelectedRowKeys([]);
    closeModal();
  }
  function setDataSourceItem(item: SelectGroup, index: number) {
    dataSource.splice(index, 1, item);
    setDataSource([...dataSource]);
  }
  function closeModal() {
    setVisible(false);
  }

  async function formatAuthGroupToSelectGroup(personGroup: FileManageFileAuthGroup) {
    const cacheData: SelectGroup[] = [];
    async function selectGroupToDataSource(
      values: number[],
      type: SelectGroup['type'],
      mode: FileManageAuthModeEnum = FileManageAuthModeEnum.Review,
    ): Promise<SelectGroup[]> {
      let serach: Record<number, string>;
      if (type === 'user') {
        serach = (await storageDataSource.getValue(STORAGE_USER_LIST)).serachRecord;
      } else if (type === 'dept') {
        serach = (await storageDataSource.getValue(STORAGE_DEPT_LIST)).serachRecord;
      } else if (type === 'role') {
        serach = (await storageDataSource.getValue(STORAGE_ROLE_LIST)).serachRecord;
      }
      return values.map((value) => ({
        title: serach[value] || '已被删除',
        value,
        type,
        mode,
        key: value + '_ ' + type,
      }));
    }
    if (!isEmpty(personGroup.userIds)) {
      cacheData.push(
        ...(await selectGroupToDataSource(
          personGroup.userIds as number[],
          'user',
          personGroup.mode,
        )),
      );
    }
    if (!isEmpty(personGroup.roleIds)) {
      cacheData.push(
        ...(await selectGroupToDataSource(
          personGroup.roleIds as number[],
          'role',
          personGroup.mode,
        )),
      );
    }
    if (!isEmpty(personGroup.deptIds)) {
      cacheData.push(
        ...(await selectGroupToDataSource(
          personGroup.deptIds as number[],
          'dept',
          personGroup.mode,
        )),
      );
    }
    return cacheData;
  }
  return (
    <>
      <Modal
        title="设置文件权限"
        visible={visible}
        width={600}
        onOk={handleFinish}
        maskClosable={false}
        keyboard={false}
        onCancel={closeModal}
        confirmLoading={loading}
      >
        <SelectSystemPerson
          multiple
          showDept
          showRole
          showUser
          onFinish={async (personGroup) => {
            dataSource.push(...(await formatAuthGroupToSelectGroup(personGroup)));

            setDataSource([...jsonUniq(dataSource, 'value', 'type')]);
          }}
        >
          <Button loading={loading} icon={<PlusOutlined />} block>
            添加人员权限
          </Button>
        </SelectSystemPerson>
        <div className={styles['person-list']}>
          <ProList<SelectGroup>
            metas={{
              title: {
                render: (dom, record) => (
                  <Space>
                    <TypeTag type={record.type} />
                    {record.title}
                  </Space>
                ),
                dataIndex: 'title',
              },
              extra: {
                render: (dom, record: SelectGroup, index) => (
                  <SelectAuthMode
                    key="SelectAuthMode"
                    value={record.mode}
                    onChange={(value) => {
                      console.log(value);

                      setDataSourceItem({ ...record, mode: value }, index);
                    }}
                  />
                ),
              },
            }}
            rowKey="key"
            headerTitle="支持选中的列表"
            rowSelection={rowSelection}
            dataSource={dataSource}
            tableAlertOptionRender={({ selectedRowKeys: keys }) => {
              return (
                <Space size={16}>
                  <Button
                    onClick={() => {
                      setSelectedRowKeys([]);
                      setDataSource([...dataSource.filter((item) => !keys.includes(item.key))]);
                    }}
                    danger
                  >
                    批量删除
                  </Button>
                  <Button onClick={() => setSelectedRowKeys([])}>取消选择</Button>
                </Space>
              );
            }}
          />
        </div>
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
const SelectAuthModeDataSource = [
  {
    label: '仅可查看',
    description: '仅可在线预览，不能下载',
    value: FileManageAuthModeEnum.Review,
  },
  {
    label: '可下载',
    description: '可以在线预览和下载文件',
    value: FileManageAuthModeEnum.ReviewAndDownload,
  },
  {
    label: '可操作',
    description: '可以对文件预览/下载/编辑/删除/新建文件与目录',
    value: FileManageAuthModeEnum.ReviewAndDownloadAndEdit,
  },
  {
    label: '可管理',
    description: '能够完整操作文件，并可以设置权限给人员',
    value: FileManageAuthModeEnum.ReviewAndDownloadAndEditAndControl,
  },
];
/**
 * 人员类型标签
 */
function TypeTag(props: { type: SelectGroup['type'] }) {
  if (props.type === 'user') {
    return (
      <Avatar style={{ backgroundColor: '#9254de' }} size={32}>
        用户
      </Avatar>
    );
  } else if (props.type === 'role') {
    return (
      <Avatar style={{ backgroundColor: '#87d068' }} size={32}>
        角色
      </Avatar>
    );
  } else {
    return (
      <Avatar style={{ backgroundColor: '#1890ff' }} size={32}>
        部门
      </Avatar>
    );
  }
}
/**
 * 选择权限模式
 */
function SelectAuthMode(props: { value?: number; onChange?: (value: number) => void }) {
  return (
    <Select
      value={props.value}
      style={{ width: 120 }}
      optionLabelProp="label"
      onChange={(value) => {
        console.log(value);

        props?.onChange?.(value);
      }}
      dropdownStyle={{ minWidth: 350 }}
    >
      {SelectAuthModeDataSource.map((item) => {
        return (
          <Select.Option key={item.label} value={item.value} label={item.label}>
            <div className={styles.title}>{item.label}</div>
            <div className={styles.description}>{item.description}</div>
          </Select.Option>
        );
      })}
    </Select>
  );
}

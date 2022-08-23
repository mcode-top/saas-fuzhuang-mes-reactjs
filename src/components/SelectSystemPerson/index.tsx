/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { NameAndIdType } from '@/apis/comm';
import { STORAGE_DEPT_LIST, STORAGE_ROLE_LIST, STORAGE_USER_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import { ReloadOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-card';
import { Button, Modal, Tabs } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import styles from './index.less';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-29 21:07:17
 * 选择系统人员
 */
export type SelectSystemPersonGroup = PersonGroup;
export type SelectSystemPersonType = {
  /**@name 显示用户列表 */
  showUser?: boolean;
  /**@name 显示角色列表 */
  showRole?: boolean;
  /**@name 显示部门列表 */
  showDept?: boolean;
  /**@name 是否多选 */
  multiple?: boolean;
  value?: SelectSystemPersonGroup;
  onChange?: (value: SelectSystemPersonGroup | undefined) => void;
  onFinish?: (value: SelectSystemPersonGroup | undefined) => Promise<any>;
  children: JSX.Element;
};
type TabKeys = 'user' | 'dept' | 'role';
export default function SelectSystemPerson(props: SelectSystemPersonType) {
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState<TabKeys>('user');
  const [userIds, setUserIds] = useState<number[]>([]);
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [deptIds, setDeptIds] = useState<number[]>([]);
  const userRef = useRef<SelectListRef>();
  const roleRef = useRef<SelectListRef>();
  const deptRef = useRef<SelectListRef>();
  useEffect(() => {
    if (props.value) {
      props?.value?.userIds && setUserIds(props.value.userIds);
      props?.value?.roleIds && setRoleIds(props.value.roleIds);
      props?.value?.deptIds && setDeptIds(props.value.deptIds);
    }
  }, [props.value]);
  useEffect(() => {
    if (props.showUser) {
      setTabKey('user');
    } else if (props.showRole) {
      setTabKey('role');
    } else if (props.showDept) {
      setTabKey('dept');
    }
  }, []);
  function handleRefresh() {
    if (tabKey === 'user') {
      userRef.current?.refersh();
    } else if (tabKey === 'role') {
      roleRef.current?.refersh();
    } else if (tabKey === 'dept') {
      deptRef.current?.refersh();
    }
  }
  async function handleFinish() {
    let empty = false;
    if (isEmpty(userIds) && isEmpty(roleIds) && isEmpty(deptIds)) {
      empty = true;
    }
    if (props?.onChange) {
      props.onChange(empty ? undefined : { userIds, roleIds, deptIds });
    }
    if (props?.onFinish) {
      await props.onFinish(empty ? undefined : { userIds, roleIds, deptIds });
    }
    closeModal();
  }
  function closeModal() {
    setUserIds([]);
    setRoleIds([]);
    setDeptIds([]);
    setVisible(false);
  }
  return (
    <>
      <Modal
        title="选择系统人员"
        visible={visible}
        width={600}
        onOk={handleFinish}
        maskClosable={false}
        keyboard={false}
        onCancel={closeModal}
      >
        <Tabs
          activeKey={tabKey}
          onChange={(key) => setTabKey(key as TabKeys)}
          tabBarExtraContent={
            <Button onClick={handleRefresh} icon={<ReloadOutlined />}>
              刷新
            </Button>
          }
        >
          {props.showUser && (
            <Tabs.TabPane key="user" tab="用户列表">
              <SelectList
                ref={userRef}
                onChange={setUserIds}
                checkKeys={userIds}
                multiple={props.multiple}
                request={async (sync) => {
                  return (await storageDataSource.getValue(STORAGE_USER_LIST, sync)).data;
                }}
              />
            </Tabs.TabPane>
          )}
          {props.showRole && (
            <Tabs.TabPane key="role" tab="角色列表">
              <SelectList
                ref={roleRef}
                onChange={setRoleIds}
                checkKeys={roleIds}
                multiple={props.multiple}
                request={async (sync) => {
                  return (await storageDataSource.getValue(STORAGE_ROLE_LIST, sync)).data;
                }}
              />
            </Tabs.TabPane>
          )}
          {props.showDept && (
            <Tabs.TabPane key="dept" tab="部门列表">
              <SelectList
                ref={deptRef}
                multiple={props.multiple}
                onChange={setDeptIds}
                checkKeys={deptIds}
                request={async (sync) => {
                  return (await storageDataSource.getValue(STORAGE_DEPT_LIST, sync)).data;
                }}
              />
            </Tabs.TabPane>
          )}
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

type SelectListRef = {
  refersh: () => void;
};
const SelectList = forwardRef(function (
  props: {
    checkKeys?: number[];
    value?: NameAndIdType[];
    multiple?: boolean;
    onChange?: (value: number[]) => void;
    request?: (sync: boolean) => Promise<NameAndIdType[]>;
  },
  ref: React.Ref<SelectListRef | undefined>,
) {
  const [value, setValue] = useState<NameAndIdType[]>([]);
  const [loading, setLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    refersh: () => refersh(true),
  }));
  useEffect(() => {
    if (props?.value) {
      setValue(props.value);
    }
  }, [props.value]);
  useEffect(() => {
    refersh();
  }, []);

  async function refersh(sync: boolean = false) {
    if (props?.request) {
      setLoading(true);
      const data = await props.request(sync).finally(() => {
        setLoading(false);
      });
      setValue(data);
    }
  }

  return (
    <>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <CheckCard.Group
          loading={loading}
          multiple={props?.multiple || false}
          className={styles['select-system']}
          onChange={(cvalue) => {
            if (Array.isArray(cvalue)) {
              props?.onChange?.(cvalue as number[]);
            } else {
              if (cvalue === undefined) {
                props?.onChange?.([]);
              } else {
                props?.onChange?.([cvalue as number]);
              }
            }
          }}
          value={props?.multiple ? props.checkKeys : props.checkKeys && props.checkKeys[0]}
        >
          {!loading
            ? value.map((item) => {
                return (
                  <CheckCard
                    key={item.id}
                    style={{ width: '100%' }}
                    title={item.name}
                    value={item.id}
                  />
                );
              })
            : null}
        </CheckCard.Group>
      </div>
    </>
  );
});

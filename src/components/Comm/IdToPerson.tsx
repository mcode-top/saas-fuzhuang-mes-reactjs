/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-18 13:36:21
 * @Description: 通过ID变更为名称
 */
import { STORAGE_DEPT_LIST, STORAGE_ROLE_LIST, STORAGE_USER_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import { Alert, Col, Descriptions, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Access } from 'umi';
export type IdToPersonProps = {
  person: PersonGroup | undefined;
  showTypeTitle?: boolean;
};
const PERSON_NAME_ENUM = {
  userIds: '用户',
  roleIds: '角色',
  deptIds: '部门',
};
const IdToPerson: React.FC<IdToPersonProps> = ({ person, showTypeTitle }) => {
  const [loading, setLoading] = useState(false);
  const [deptSerach, setDeptSerach] = useState(null);
  const [roleSerach, setRoleSerach] = useState(null);
  const [userSerach, setUserSerach] = useState(null);
  useEffect(() => {
    if (person) {
      init();
    }
  }, [person]);
  async function init() {
    setLoading(true);
    try {
      if (person?.deptIds) {
        setDeptSerach(
          await storageDataSource.getValue(STORAGE_DEPT_LIST).then((res) => res.serachRecord),
        );
      }
      if (person?.roleIds) {
        setRoleSerach(
          await storageDataSource.getValue(STORAGE_ROLE_LIST).then((res) => res.serachRecord),
        );
      }
      if (person?.userIds) {
        setUserSerach(
          await storageDataSource.getValue(STORAGE_USER_LIST).then((res) => res.serachRecord),
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  if (!person) {
    return <Alert type="warning" message="当前人员为空" />;
  }
  return (
    <Spin spinning={loading}>
      <Row gutter={[0, 8]}>
        {Object.keys(person).map((key) => {
          if (!isEmpty(person[key])) {
            return (
              <Col span={24} key={key + person[key]}>
                <Access accessible={Boolean(showTypeTitle)}>
                  <span style={{ fontWeight: 600 }}>{PERSON_NAME_ENUM[key] + ':'}</span>
                </Access>
                {person[key]
                  .map((id) => {
                    if (id === undefined) return;
                    let con: any = null;
                    if (key === 'userIds') {
                      con = userSerach;
                    } else if (key === 'roleIds') {
                      con = roleSerach;
                    } else if (key === 'deptIds') {
                      con = deptSerach;
                    }

                    if (con) {
                      return con[id] || `${PERSON_NAME_ENUM[key]}已被删除`;
                    }
                  })
                  .join(',')}
              </Col>
            );
          } else {
            return null;
          }
        })}
      </Row>
    </Spin>
  );
};
export default IdToPerson;

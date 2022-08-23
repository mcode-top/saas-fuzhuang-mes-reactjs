import React from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, Avatar } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useModel, useRequest } from 'umi';

import styles from './baseView.less';
import { updateAvatar, updateCurrentUser } from '@/apis/user';
import { getInitialState } from '@/app';
import { useState } from 'react';
import { UserValueEnum } from '@/configs/commValueEnum';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = (props: { avatar: string; onChange?: (filepath: string) => any }) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <Avatar src={props.avatar} size={144} icon={<UserOutlined />} />
      </div>
      <Upload
        showUploadList={false}
        accept="image/*"
        customRequest={(options) => {
          setLoading(true);
          updateAvatar(options.file as File)
            .then((res) => {
              props.onChange?.(res.data);
            })
            .finally(() => setLoading(false));
        }}
      >
        <div className={styles.button_view}>
          <Button loading={loading}>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
};

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  if (!initialState?.currentUser) return <></>;
  const currentUser = initialState.currentUser;
  const handleFinish = async (formData) => {
    await updateCurrentUser(formData);
    setInitialState({ ...initialState, currentUser: { ...currentUser, ...formData } });
    message.success('更新基本信息成功');
  };
  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <ProForm
          layout="vertical"
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '更新基本信息',
            },
          }}
          initialValues={{
            ...currentUser,
          }}
          hideRequiredMark
        >
          <ProFormText
            width="md"
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: '请输入正确的邮箱!',
                type: 'email',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="phone"
            label="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="name"
            label="昵称"
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          />
          <ProFormTextArea name="remark" label="备注" placeholder="个人简介" />
          <ProFormSelect
            width="md"
            name="sex"
            options={[...UserValueEnum.Sex].map((item) => ({
              label: item[1].text,
              value: item[0],
            }))}
          />
        </ProForm>
      </div>
      <div className={styles.right}>
        <AvatarView
          avatar={currentUser.headImage}
          onChange={(filepath) => {
            currentUser.headImage = filepath;
            setInitialState({ ...initialState, currentUser: currentUser });
          }}
        />
      </div>
    </div>
  );
};

export default BaseView;

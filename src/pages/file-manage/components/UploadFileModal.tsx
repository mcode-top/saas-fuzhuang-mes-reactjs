import type { FileManageModeEnum } from '@/apis/file-manage/typings';
import { jsonUniq } from '@/utils';
import { uploadFileToOss } from '@/utils/upload/upload';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button, List, message, Modal, Progress, Space } from 'antd';
import { useRef, useState } from 'react';
import { transformFileSize } from '../file-manage.utils';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 19:26:32
 * 上传文件
 */
type UploadFileListType = {
  name: string;
  size: number;
  description?: string;
  file: File;
  status?: 'upload' | 'default' | 'done' | 'error';
  progress?: number;
  progressText?: string;
};
type ReturnFileValue = { name: string; position: string };
export default function UploadReviewListModal(props: {
  children: JSX.Element;
  parentId: number;
  description?: string;
  mode: FileManageModeEnum;
  /**@name 是否支持上传多文件 默认true */
  multiple?: boolean;
  onFinish?: (fileList: ReturnFileValue[]) => void;
}) {
  const [fileList, setFileList] = useState<UploadFileListType[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returnFileValue, setReturnFileValue] = useState<ReturnFileValue[]>([]);
  function closeModal(value?: ReturnFileValue[]) {
    setVisible(false);
    setFileList([]);
    setReturnFileValue([]);
    props?.onFinish?.(value || returnFileValue);
  }
  function changeFileItem(newItem, index) {
    fileList.splice(index, 1, newItem);
    setFileList([...fileList]);
  }
  /**
   * 选择本地文件
   */
  function handleSelectFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = props.multiple === true;
    fileInput.click();
    fileInput.onchange = (event) => {
      if (fileInput.files) {
        const newFileList: UploadFileListType[] = [];
        for (let index = 0; index < fileInput.files.length; index++) {
          const file = fileInput.files[index];
          newFileList.push({
            file: file,
            name: file.name,
            description: props.description,
            size: file.size,
          });
        }
        if (props.multiple !== true) {
          return setFileList([newFileList[0]]);
        }
        return setFileList([...fileList, ...newFileList]);
      }
    };
  }
  /**
   * 上传文件到服务器
   */
  async function handleUpload() {
    setLoading(true);
    const returnInfos: ReturnFileValue[] = [];
    try {
      for (let index = 0; index < fileList.length; index++) {
        const item = fileList[index];
        if (item.status === 'upload' || item.status === 'done') {
          return;
        }
        item.status = 'upload';
        try {
          changeFileItem(item, index);
          await uploadFileToOss(item.file, {
            parentId: props.parentId,
            description: item.description,
            mode: props.mode,
            progressEvent(loadedSize: string, totalSize: string, progress: number): void {
              item.progress = progress;
              item.progressText = `${loadedSize}/${totalSize} ${progress}%`;
              changeFileItem(item, index);
            },
          })
            .then((res) => {
              returnInfos.push(res);
              item.status = 'done';
              changeFileItem(item, index);
            })
            .catch((e) => {
              console.error(e);
              item.status = 'error';
              changeFileItem(item, index);
            });
        } catch (error) {
          console.log('====================================');
          console.log(error, '上传失败');
          console.log('====================================');
        }
      }
    } catch (error) {
      console.log(error, '上传错误');
    } finally {
      const cache: ReturnFileValue[] = jsonUniq([...returnFileValue, ...returnInfos], 'position');
      setReturnFileValue(cache);
      setLoading(false);
      const errorFileList = fileList.filter((item) => item.status === 'error');
      if (errorFileList.length > 0) {
        message.error('有部分文件上传失败请查询上传');
      } else {
        closeModal(cache);
      }
    }
  }
  return (
    <>
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        {props.children}
      </div>
      <Modal
        confirmLoading={loading}
        width={800}
        title="上传文件"
        visible={visible}
        okText="上传"
        onOk={handleUpload}
        onCancel={() => closeModal()}
        cancelButtonProps={{
          loading: loading,
        }}
        maskClosable={false}
        keyboard={false}
        closable={false}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={handleSelectFile}>请选择要上传的文件</Button>
          <List
            bordered
            dataSource={fileList}
            renderItem={(item, index) => {
              return (
                <>
                  <List.Item
                    key={item.size}
                    actions={[
                      <EditItemFile
                        key="a"
                        node={item}
                        onChange={(values) => {
                          changeFileItem(values, index);
                        }}
                      >
                        <Button
                          type="link"
                          disabled={item.status === 'upload' || item.status === 'done'}
                        >
                          编辑
                        </Button>
                      </EditItemFile>,
                      <Button
                        danger
                        key="b"
                        type="link"
                        disabled={item.status === 'upload' || item.status === 'done'}
                        onClick={() => {
                          fileList.splice(index, 1);
                          setFileList([...fileList]);
                        }}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <UploadFileStatus status={item.status} />
                          {item.name}
                        </Space>
                      }
                      description={item.description}
                    />
                    <div>{transformFileSize(item.size)}</div>
                  </List.Item>
                  {item.status === 'upload' ? (
                    <div style={{ display: 'flex', padding: 10 }}>
                      <Progress style={{ flexGrow: 1 }} percent={item.progress} format={() => ''} />
                      <div style={{ minWidth: 200, flexShrink: 0 }}>{item.progressText}</div>
                    </div>
                  ) : null}
                </>
              );
            }}
          />
        </Space>
      </Modal>
    </>
  );
}

function EditItemFile(props: {
  node: UploadFileListType;
  children: JSX.Element;
  onChange?: (values: UploadFileListType) => void;
}) {
  const formRef = useRef<ProFormInstance>();

  return (
    <ModalForm
      width={500}
      title="修改文件信息"
      initialValues={props.node}
      trigger={props.children}
      formRef={formRef}
      onFinish={async (values: UploadFileListType) => {
        props?.onChange?.({ ...props.node, ...values });
        formRef.current?.resetFields();
        return true;
      }}
    >
      <ProFormText label="名称" rules={[{ required: true }]} disabled name="name" />
      <ProFormTextArea label="描述" name="description" />
    </ModalForm>
  );
}

function UploadFileStatus(props: { status: UploadFileListType['status'] }) {
  switch (props.status) {
    case 'error':
      return <CloseCircleOutlined className="ant-tag-error" />;
    case 'upload':
      return <LoadingOutlined />;
    case 'done':
      return <CheckCircleOutlined className="ant-tag-success" />;
    default:
      return <InfoOutlined className="ant-tag-default" />;
  }
}

import { FileManageModeEnum } from '@/apis/file-manage/typings';
import type { IFileList } from '@/pages/file-manage/components/SelectFileModal';
import SelectFileModal from '@/pages/file-manage/components/SelectFileModal';
import UploadReviewListModal from '@/pages/file-manage/components/UploadFileModal';
import { jsonUniq } from '@/utils';
import { downloadSystemFile } from '@/utils/upload/upload';
import { DownOutlined } from '@ant-design/icons';
import { ArrayItems } from '@formily/antd';
import { ArrayField, useField } from '@formily/react';
import { Alert, Avatar, Button, Card, Col, Dropdown, Form, List, Menu, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import FilePositionImage from '../FilePositionImage';
import { PhotoView } from 'react-photo-view';
import ProForm from '@ant-design/pro-form';

export type ImageIFileListProps = {
  showImage?: boolean;
  imageSize?: number;
  imageColumn?: number;
};

/**
 * 预览文件列表
 */
export const IFileListNode: React.FC<{
  showDelete?: boolean;
  showDownload?: boolean;
  imageProps?: ImageIFileListProps;
  value: IFileList;
  onChange?: (fileList: IFileList) => void;
}> = (props) => {
  if (isEmpty(props.value)) {
    return <Alert type="warning" message="当前文件列表为空" />;
  }
  return (
    <List
      size="small"
      bordered
      dataSource={props.value}
      grid={
        props?.imageProps?.showImage
          ? { column: props?.imageProps?.imageColumn || 3 }
          : { column: 1 }
      }
      renderItem={(item) => {
        const actions = [
          <Button
            type="link"
            key="download"
            onClick={() => downloadSystemFile(item.position as string)}
          >
            下载
          </Button>,
          <Button
            danger
            type="link"
            key="delete"
            onClick={() => {
              props?.onChange?.(props.value.filter((i) => i.position !== item.position));
            }}
          >
            删除
          </Button>,
        ].filter((button) => {
          if (button.key === 'download' && props.showDownload) {
            return true;
          }
          if (button.key === 'delete' && props.showDelete) {
            return true;
          }
          return false;
        });
        return (
          item.position && (
            <List.Item key={item.position} actions={props?.imageProps?.showImage ? [] : actions}>
              {props?.imageProps?.showImage ? (
                <Card size="small" title={item.name} extra={actions}>
                  <FilePositionImage
                    avaterProps={{ size: props?.imageProps?.imageSize || 64 }}
                    src={item.position}
                    isRemote={true}
                  />
                </Card>
              ) : (
                item.name
              )}
            </List.Item>
          )
        );
      }}
    />
  );
};

/**
 * 上传本地文件或者选择文件列表
 */
const SelectUploadFile: React.FC<{
  /**@name 是否支持上传多文件 */
  multiple?: boolean;
  value?: IFileList;
  readonly?: boolean;
  accpet?: string;
  showImage?: boolean;
  imageProps?: ImageIFileListProps;
  description?: string;
  onChange?: (fileList: IFileList | undefined) => any;
}> = (props) => {
  const upForm = useField();
  const [fileList, setFileList] = useState<IFileList>([]);
  function emitChange(list: IFileList) {
    if (list.length === 0) {
      setFileList([]);
      props?.onChange?.(undefined);
      return;
    }
    const uniqList = jsonUniq(list, 'position');
    setFileList(uniqList);
    props?.onChange?.(uniqList);
  }
  useEffect(() => {
    setFileList(props.value || []);
  }, [props.value]);

  // Formly只读时
  if (props.readonly || (upForm && (upForm.readPretty || upForm.readOnly))) {
    return <IFileListNode value={fileList} showDownload imageProps={props.imageProps} />;
  }
  return (
    <Row gutter={[0, 12]}>
      <Col span={24}>
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu>
              <UploadReviewListModal
                parentId={-1}
                accept={props.accpet}
                multiple={props.multiple}
                description={props.description}
                mode={FileManageModeEnum.Personage}
                onFinish={(value) => {
                  if (props.multiple) {
                    emitChange([...fileList, ...value]);
                  } else {
                    emitChange(value);
                  }
                }}
              >
                <Menu.Item eventKey="local">上传本地文件</Menu.Item>
              </UploadReviewListModal>
              <SelectFileModal
                type="file"
                showOrganizationFileList
                showMyFileList
                showSelect
                multiple={props.multiple}
                onFinish={async ({ fileList: value }) => {
                  if (props.multiple) {
                    emitChange([...fileList, ...value]);
                  } else {
                    emitChange(value);
                  }
                }}
              >
                <Menu.Item eventKey="system">选择文件管理文件</Menu.Item>
              </SelectFileModal>
            </Menu>
          }
        >
          <Button icon={<DownOutlined />}>选择上传方式</Button>
        </Dropdown>
      </Col>

      <Col span={24}>
        <IFileListNode
          imageProps={props.imageProps}
          value={fileList}
          onChange={emitChange}
          showDelete
          showDownload
        />
      </Col>
    </Row>
  );
};

export default SelectUploadFile;

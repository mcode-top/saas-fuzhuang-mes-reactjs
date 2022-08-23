/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-02 16:40:36
 * @Description: 文件描述
 */

import { transformFileSize } from '@/pages/file-manage/file-manage.utils';
import { notification, Progress } from 'antd';
import { v4 as uuidv4 } from 'uuid';

export function uploadProgress(
  key: string,
  filename: string,
  option: { loaded: number; total: number },
) {
  if (option.total === 0) {
    return '';
  }

  const uid = key || uuidv4();
  const progress = Math.floor((option.loaded / option.total) * 10000) / 100;
  const loadedSize = transformFileSize(option.loaded);
  const totalSize = transformFileSize(option.total);
  const done = progress >= 100;
  notification.open({
    key: uid,
    type: done ? 'success' : 'info',
    message: done ? `${filename}下载完成` : `正在下载${filename}`,
    duration: done ? 5 : null,
    placement: 'bottomLeft',
    description: (
      <div>
        <div>{`${loadedSize}/${totalSize} ${progress}%`}</div>
        <Progress
          format={() => {
            return ``;
          }}
          percent={progress}
        />
      </div>
    ),
  });
  return uid;
}

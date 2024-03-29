import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-24 10:25:55
 * 文件上传工具
 */
import { TENANT_HEADER, TENANT_HEADER_TOKEN, TENANT_SESSION_PATH } from '@/configs/index.config';
import { request } from 'umi';
import JsFileDownloader from 'js-file-downloader';
import { message, notification } from 'antd';
import { transformFileSize } from '@/pages/file-manage/file-manage.utils';
import { uploadProgress } from './uploadProgress';
import type { FileManageModeEnum } from '@/apis/file-manage/typings';
import { getOssFileIdToTimeLink, getOssPosistionToTimeLink } from '@/apis/file-manage/file-manage';
import { isEmpty } from 'lodash';

export function getOssSgin(mode: FileManageModeEnum, parentId: number) {
  return request<
    RESULT_SUCCESS<{
      expire: string;
      policy: string;
      signature: string;
      accessid: string;
      host: string;
      callback: string;
      dir: string;
    }>
  >('/file-manage/oss/sign', {
    method: 'GET',
    params: { mode, parentId },
  });
}
export async function uploadFileToOss(
  file: File,
  options: {
    parentId: number;
    description?: string;
    mode: FileManageModeEnum;
    progressEvent?: (loadedSize: string, totalSize: string, progress: number) => void;
  },
) {
  const ossSign = (await getOssSgin(options.mode, options.parentId)).data;
  const date = moment();
  const form = new FormData();
  const key =
    ossSign.dir +
    '/' +
    date.format('YYYY-MM-DD') +
    '/' +
    date.format('HH_mm_ss_SSS_') +
    Math.floor(Math.random() * 100000) +
    file.name;

  form.append('name', file.name);
  form.append('key', key);
  form.append('policy', ossSign.policy);
  form.append('OSSAccessKeyId', ossSign.accessid);
  form.append('signature', ossSign.signature);
  form.append('callback', ossSign.callback);
  form.append('expire', ossSign.expire);
  form.append('success_action_status', '200');
  form.append('x:description', options.description || '');
  form.append('x:name', file.name);
  form.append('x:parent_id', options.parentId.toString());
  form.append('file', file);

  await xhrUploadFile(ossSign.host, form, (loadedSize, totalSize, progress) => {
    options?.progressEvent?.(loadedSize, totalSize, progress);
  });
  return {
    name: file.name,
    position: key,
  };
}
export function xhrUploadFile(
  url: string,
  data: FormData,
  progressEvent?: (loadedSize: string, totalSize: string, progress: number) => void,
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 600000;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.floor((event.loaded / event.total) * 10000) / 100;
      const loadedSize = transformFileSize(event.loaded);
      const totalSize = transformFileSize(event.total);
      progressEvent?.(loadedSize as string, totalSize as string, progress);
    };
    xhr.onreadystatechange = function (event) {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          try {
            resolve(JSON.parse(xhr.response));
          } catch (error) {
            console.error(xhr.response);
            reject(new Error('返回异常,上传文件失败'));
          }
        } else {
          reject(xhr.response);
        }
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader(TENANT_HEADER, sessionStorage.getItem(TENANT_SESSION_PATH) as string);
    xhr.setRequestHeader(
      TENANT_HEADER_TOKEN,
      sessionStorage.getItem(TENANT_HEADER_TOKEN) as string,
    );
    xhr.send(data);
  });
}

/**
 * 下载文件
 * @param {Blob|File|String} file 文件
 * @param {string} filename 文件名
 */
export function downloadAction(url: string, filename: string = '') {
  const tips = filename ? `[${filename}]` : '';
  let uid = '';
  const file = new JsFileDownloader({
    url: url,
    filename: filename,
    autoStart: false,
    headers: [
      {
        value: sessionStorage.getItem(TENANT_HEADER_TOKEN) as any,
        name: TENANT_HEADER_TOKEN,
      },
      {
        value: sessionStorage.getItem(TENANT_SESSION_PATH) as any,
        name: TENANT_HEADER,
      },
    ],
  });
  file.params.contentType = false;

  const p = file.start();
  file.request.onprogress = (event) => {
    uid = uploadProgress(uid, tips, { loaded: event.loaded, total: event.total });
  };
  return p.catch((err) => {
    console.log(err);
    if (uid) {
      notification.close(uid);
    }
    notification.error({
      placement: 'bottomLeft',
      message: '文件' + tips + '下载失败',
      duration: 5,
    });
  });
}

/**
 * 下载系统文件
 * @param value 文件短地址(position)或文件Id(fileId)
 */
export async function downloadSystemFile(value: number | string) {
  let result: {
    url: string;
    filename: string;
  };
  if (value === undefined || value === null) {
    message.warn('下载失败,未知参数');
  } else {
    if (typeof value === 'number') {
      result = (await getOssFileIdToTimeLink(value)).data;
    } else {
      result = (await getOssPosistionToTimeLink(value)).data;
    }
    await downloadAction(result.url, result.filename);
  }
}

/**@name 选择本地文件 */
export function SelectLocalFile(options?: {
  multiple?: boolean;
  accept?: string;
}): Promise<File | File[]> {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = options?.multiple === true;
    fileInput.click();
    fileInput.accept = options?.accept || '';
    fileInput.onerror = (err) => {
      message.error('选择本地失败失败');
      console.error(err);
      reject(err);
    };
    fileInput.onchange = (event) => {
      if (fileInput.files) {
        if (fileInput.multiple) {
          const files: File[] = [];
          for (let index = 0; index < fileInput.files.length; index++) {
            files.push(fileInput.files[index]);
          }
          resolve(files);
        } else {
          resolve(fileInput.files[0]);
        }
      } else {
        message.error('选择本地失败失败');
        console.error(event);
        reject(event);
      }
    };
  });
}

/**@name 将文件类型转换为字符 */
export function fileToBinaryString(file: File): Promise<ArrayBuffer | string | null | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e?.target?.result);
    };
    reader.onerror = function (err) {
      console.error(err);
      message.error('文件转换失败');
      reject(err);
    };
    reader.readAsBinaryString(file);
  });
}

/**@name 浏览器下载文件ArrayBuffer */
export function browersArrayBufferDownload(filename: string, buf: ArrayBuffer) {
  const link = document.createElement('a');
  const body = document.querySelector('body');
  link.href = window.URL.createObjectURL(new Blob([buf], { type: 'arrayBuffer' }));
  link.download = filename;

  link.style.display = 'none';
  body?.appendChild(link);

  link.click();
  body?.removeChild(link);
  // 释放对象
  window.URL.revokeObjectURL(link.href);
}

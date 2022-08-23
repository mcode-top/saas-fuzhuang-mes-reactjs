/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:05:43
 * 我的文件目录
 */
import { FileManageModeEnum } from '@/apis/file-manage/typings';
import { fetchMyFilePage } from '@/apis/file-manage/file-manage';
import FileManageList from '../components/FileList';

export default function MyFileLis() {
  return (
    <FileManageList
      showCreateCatalog
      showOpertion
      showUploadFile
      request={fetchMyFilePage}
      mode={FileManageModeEnum.Personage}
    />
  );
}

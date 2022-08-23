/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:29:23
 * 文件管理工具类
 */
const sizeKB = 1024;
const sizeMB = 1024 * sizeKB;
const sizeGB = 1024 * sizeMB;
export function transformFileSize(size) {
  try {
    if (size >= sizeKB && size <= sizeMB) {
      return (size / sizeKB).toFixed(2) + 'KB';
    } else if (size > sizeMB && size <= sizeGB) {
      return (size / sizeMB).toFixed(2) + 'MB';
    } else if (size > sizeGB) {
      return (size / sizeGB).toFixed(2) + 'GB';
    } else {
      return size.toFixed(2) + 'B';
    }
  } catch (error) {
    return null;
  }
}

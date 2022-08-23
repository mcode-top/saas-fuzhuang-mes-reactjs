import { request } from 'umi';
import type {
  FileManageFileItem,
  FileManageOpeartionCatalogDto,
  FileManageCatalogItem,
  FileManageUpdateFile,
  FileManageModeEnum,
  FileManageUpdateFileAuthDto,
  FileManageOrganizationFileItem,
  FileManageFileAuthGroup,
} from './typings';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:08:29
 * 文件管理接口
 */
//-----------------------------------关于组织的文件管理接口
/**
 * 获取组织文件分页
 */
export function fetchOrganizationFilePage(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<FileManageOrganizationFileItem> & { parentPath?: { name: string; id: number; parentId: number }[] }>>(
    '/file-manage/organization/fileOrCatalog/page',
    {
      method: 'POST',
      data,
    },
  );
}
/**
 * 新增组织的目录
 */
export function createOrganizationCatalog(data: FileManageOpeartionCatalogDto) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<number>>>(
    '/file-manage/organization/catalog/create',
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 获取组织的目录树
 */
export function fetchOrganizationCatalogTree() {
  return request<RESULT_SUCCESS<FileManageCatalogItem[]>>('/file-manage/organization/catalog/tree', {
    method: 'GET',
  });
}
/**
 * 获取用户对于当前文件或目录的权限
 */
export function fetchOrganizationFileToAuthGroup(fileId: number,) {
  return request<RESULT_SUCCESS<FileManageFileAuthGroup[]>>('/file-manage/organization/auth-group/' + fileId, {
    method: 'GET',
  });
}

/**
 * 更新组织文件权限
 */
export function updateOranizationFileAuthGroup(fileId: number, data: FileManageFileAuthGroup[]) {
  return request<RESULT_SUCCESS>('/file-manage/fileOrCatalog/auth/' + fileId, {
    method: "PATCH",
    data
  })
}
//-----------------------------------关于我的文件管理接口
/**
 * 获取我的文件分页
 */
export function fetchMyFilePage(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<FileManageFileItem> & { parentPath?: { name: string; id: number; parentId: number }[] }>>(
    '/file-manage/my/file/page',
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 新增我的目录
 */
export function createMyCatalog(data: FileManageOpeartionCatalogDto) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<number>>>(
    '/file-manage/my/catalog/create',
    {
      method: 'POST',
      data,
    },
  );
}

/**
 * 获取我的目录树
 */
export function fetchMyCatalogTree() {
  return request<RESULT_SUCCESS<FileManageCatalogItem[]>>('/file-manage/my/catalog/tree', {
    method: 'GET',
  });
}



//-----------------------------------公用文件管理接口

/**
 * 更新文件或目录基本信息
 */
export function updateFileOrCatalogBasic(id: number, data: FileManageUpdateFile) {
  return request<RESULT_SUCCESS>('/file-manage/fileOrCatalog/' + id, {
    method: 'PATCH',
    data,
  });
}
/**
 * 更新文件或目录基本信息
 */
export function updateFileOrCatalogAuth(id: number, data: FileManageUpdateFileAuthDto) {
  return request<RESULT_SUCCESS>('/file-manage/fileOrCatalog/auth/' + id, {
    method: 'PATCH',
    data,
  });
}

/**
 * 批量删除目录或者文件
 */
export function removeManyFileOrCatalog(fileIds: number[]) {
  return request<RESULT_SUCCESS>('/file-manage/fileOrCatalog/many', {
    method: 'DELETE',
    data: fileIds
  });
}
/**
 * 批量移动文件或目录到文件夹中
 */
export function moveManyFileOrCatalog(fileIds: number[], toCatalogId: number, toCatalogMode: FileManageModeEnum) {
  return request<RESULT_SUCCESS>('/file-manage/fileOrCatalog/many/move', {
    method: 'PATCH',
    data: { fileIds: fileIds, toCatalogId, toCatalogMode }
  });
}
/**
 * 批量复制文件或目录到文件夹中
 */
export function copyManyFileOrCatalog(fileIds: number[], toCatalogId: number, toCatalogMode: FileManageModeEnum) {
  return request<RESULT_SUCCESS>('/file-manage/fileOrCatalog/many/copy', {
    method: 'PATCH',
    data: { fileIds: fileIds, toCatalogId, toCatalogMode }
  });
}
/**
 * 通过文件ID获取文件临时地址
 */
export function getOssFileIdToTimeLink(fileId: number) {
  return request<RESULT_SUCCESS<{ url: string; filename: string }>>('/file-manage/oss/file-id/temp-link', {
    method: "GET",
    params: {
      fileId
    }
  })
}
/**
 * 通过文件短地址获取文件临时地址
 */
export function getOssPosistionToTimeLink(position: string) {
  return request<RESULT_SUCCESS<{ url: string; filename: string }>>('/file-manage/oss/shortTimeLink', {
    method: "GET",
    params: {
      url: position
    }
  })
}

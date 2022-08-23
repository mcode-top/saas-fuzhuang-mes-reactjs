/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-25 11:08:36
 */
/**
 * 个人文件实体
 */
export type FileManageFileItem = {
  id: number;
  name: string;
  description?: string;
  position?: string;
  size?: number;
  type: FileManageTypeEnum;
  parentId: number;
  children?: FileManageFileItem[]

};
/**
 * 文件权限组实体
 */
export type FileManageFileAuthGroup = PersonGroup & {
  mode?: FileManageAuthModeEnum;
  id?: number;
}
/**
 * 文件权限更新
 */
export type FileManageUpdateFileAuthDto = Partial<FileManageFileAuthGroup>

/**
 * 文件权限连接实体
 */
export type FileManageFileAuth = {
  fileId: number,
  fileAuthGroupId: number,
  fileAuthGroup: FileManageFileAuthGroup
}
/**
 * 组织文件实体
 */
export type FileManageOrganizationFileItem = FileManageFileItem & {
  children?: FileManageOrganizationFileItem[]
  fileAuths: FileManageFileAuth[],
  authGroup: FileManageFileAuthGroup[]
}
/**
 * 个人文件夹实体
 */
export type FileManageCatalogItem = {
  id: number;
  name: string;
  description?: string;
  parentId: number;
  children?: FileManageCatalogItem[];
};
/**
 * 文件目录信息
 */
export type FileManageOpeartionCatalogDto = {
  id?: number;
  name: string;
  description?: string;
  parentId: number;
};

export type FileManageUpdateFile = {
  name?: string;
  description?: string;
}
/**
 * 文件类型
 */
export enum FileManageTypeEnum {
  Catalog = '0',
  File = '1',
}

/**
 * 文件模式
 */
export enum FileManageModeEnum {
  Personage = '0',
  Organization = '1',
}

/**
 * 文件权限模式
 */
export enum FileManageAuthModeEnum {
  Review = '0',
  ReviewAndDownload = '1',
  ReviewAndDownloadAndEdit = '2',
  ReviewAndDownloadAndEditAndControl = '3',
}

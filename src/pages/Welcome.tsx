import React, { useEffect, useState } from 'react';
import { Card, Alert, Typography, Upload, message } from 'antd';
import styles from './Welcome.less';
import { uploadFileToOss } from '@/utils/upload/upload';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {
  return (
    <div>
      123{' '}
      <input
        type="file"
        onChange={async (event) => {
          if (event.target.files) {
            const file = event.target.files[0];
            await uploadFileToOss(file, { parentId: 0, mode: 0 });
            message.success('上传成功');
          }
        }}
      />
    </div>
  );
};

export default Welcome;

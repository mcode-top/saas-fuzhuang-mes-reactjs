import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const defaultMessage = '蚂蚁集团体验技术部出品';
  const currentYear = new Date().getFullYear();
  return (
    <div style={{ width: '100%', height: '30px', lineHeight: '30px', textAlign: 'center' }}>
      2022 杭州质慧信息技术有限公司
    </div>
    // <DefaultFooter
    //   copyright={`${currentYear} ${defaultMessage}`}
    //   links={[
    //     {
    //       key: 'Ant Design Pro',
    //       title: 'Ant Design Pro',
    //       href: 'https://pro.ant.design',
    //       blankTarget: true,
    //     },
    //     {
    //       key: 'github',
    //       title: <GithubOutlined />,
    //       href: 'https://github.com/ant-design/ant-design-pro',
    //       blankTarget: true,
    //     },
    //     {
    //       key: 'Ant Design',
    //       title: 'Ant Design',
    //       href: 'https://ant.design',
    //       blankTarget: true,
    //     },
    //   ]}
    // />
  );
};

export default Footer;

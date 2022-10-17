import styles from './index.less';
/**@name 自定义加载界面 */
const IPageLoading: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.spinner}>
        <div className={styles.bounce1} />
        <div className={styles.bounce2} />
        <div className={styles.bounce3} />
      </div>
      <div className={styles.text}>页面正在装载中,请耐心等待...</div>
    </div>
  );
};
export default IPageLoading;

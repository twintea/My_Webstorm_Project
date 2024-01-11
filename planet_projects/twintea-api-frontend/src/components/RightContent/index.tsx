import { CustomerServiceOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import '@umijs/max';
import { FloatButton } from 'antd';

export type SiderTheme = 'light' | 'dark';
export const SelectLang = () => {
  return null;
};
export const Question = () => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          height: 26,
        }}
        onClick={() => {
          window.open('https://blog.twintea.top');
        }}
      >
        <QuestionCircleOutlined />
      </div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ display: 'flex',bottom:60 }}
        tooltip={'联系网站管理员'}
        target="_blank"
        href="https://www.github.com/twintea"
        icon={<CustomerServiceOutlined />}
      />
    </div>
  );
};
export default Question;

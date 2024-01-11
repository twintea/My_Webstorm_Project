import { GithubFilled } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'twintea出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'my blog',
          title: 'twintea',
          href: 'https://blog.twintea.top',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubFilled rev={undefined} />,
          href: 'https://github.com/twintea',
          blankTarget: true,
        },
        {
          key: 'Hava a good time!',
          title: 'Ant Design',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;

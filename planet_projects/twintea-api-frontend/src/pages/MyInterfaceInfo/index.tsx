import { listMyInterfaceInfoVOPageUsingPOST } from '@/services/twintea-api-backend/interfaceInfoController';
import { FrownTwoTone,SmileTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {Card, Layout, List, message, Pagination, PaginationProps, Tooltip, notification} from 'antd';
import Search from 'antd/es/input/Search';
import { Content,Footer,Header } from 'antd/es/layout/layout';
import React,{ useEffect,useState } from 'react';
import indexStyle from './index.less';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: '64px',
  paddingInline: '30%',
  lineHeight: '64px',
  color: '#fff',
  background: 'none',
};
const footerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  lineHeight: '120px',
};

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [list, setList] = useState<API.InterfaceInfoVO[]>([]);
  const loadData = async (searchText = '', current = 1, pageSize = 6) => {
    setLoading(true);
    try {
      await listMyInterfaceInfoVOPageUsingPOST({
        name: searchText,
        current,
        pageSize,
      }).then((res) => {
        console.log(res.data);
        setTotal(res?.data?.total ?? 0);
        setList(res?.data?.records ?? []);
      });
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  const onSearch = (value: string) => {
    setSearchText(value);
    loadData(value);
  };

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log(pageNumber);
    setCurrent(pageNumber);
    loadData(searchText, pageNumber);
  };

  const onSizeChange = (current: number, size: number) => {
    loadData(searchText, current, size);
  };
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: 'error') => {
    api[type]({
      message: '接口已关闭',
      description:
        '请等待管理员开启接口或点击页面右下方的悬浮图标联系管理员',
    });
  };
  const CardInfo: React.FC<{
    totalNum: React.ReactNode;
    leftNum: React.ReactNode;
  }> = ({totalNum, leftNum}) => (
    <div className={indexStyle.cardInfo}>
      <div>
        <p>已调用次数</p>
        <p>{totalNum}</p>
      </div>
      <div>
        <p>剩余调用次数</p>
        <p>{leftNum}</p>
      </div>
    </div>
  );

  return (
    <PageContainer>
      <Layout>
        <Header style={headerStyle}>
          <Search size={'large'} placeholder="请输入接口名称" onSearch={onSearch} enterButton />
        </Header>

        <Content style={contentStyle}>
          {contextHolder}
          <List<API.InterfaceInfoVO>
            className={indexStyle.filterCardList}
            grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
            dataSource={list || []}
            loading={loading}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable={item.status === 1}
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={
                    item.status === 1
                      ? [
                          <Tooltip title="可调用" key="share">
                            <SmileTwoTone rev={undefined} />
                          </Tooltip>,
                          <Tooltip title="在线调用" key="share">
                            <div
                              onClick={() => {
                                history.push('/interface_info/' + item.id);
                              }}
                            >
                              在线调用
                            </div>
                          </Tooltip>,
                        ]
                      : [
                          <Tooltip title="接口已经关闭，请等待管理员开启" key="share">
                            <FrownTwoTone rev={undefined} />
                          </Tooltip>,
                          <Tooltip title="接口已关闭，不可调用" key="share">
                            <div onClick={() => openNotificationWithIcon('error')}>不可调用</div>
                          </Tooltip>,
                        ]
                  }
                >
                  <Card.Meta title={item.name} />
                  <div>
                    <CardInfo totalNum={item.totalNum} leftNum={item.leftNum} />
                  </div>
                </Card>
              </List.Item>
            )}
          />
          <Footer style={footerStyle}>
            <Pagination
              showQuickJumper
              showSizeChanger
              pageSizeOptions={[6, 10, 20, 30]}
              current={current}
              onShowSizeChange={onSizeChange}
              defaultPageSize={6}
              total={total}
              onChange={onChange}
            />
          </Footer>
        </Content>
      </Layout>
    </PageContainer>
  );
};

export default Index;

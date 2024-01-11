import {
    getInterfaceInfoVOByIdUsingGET,
    invokeInterfaceInfoUsingPOST,
} from '@/services/twintea-api-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import { PageContainer} from '@ant-design/pro-components';
import {Badge, Button, Card, Descriptions, Divider, Form, Image, Input, message, Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, {useEffect,  useState} from 'react';

const requestColumns: ColumnsType<API.RequestParamRemarkVO> = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '100px',
    },
    {
        title: '必填',
        key: 'isRequired',
        dataIndex: 'isRequired',
        width: '100px',
    },
    {
        title: '类型',
        dataIndex: 'type',
        width: '100px',
    },
    {
        title: '说明',
        dataIndex: 'remark',
    },
];
const responseColumns: ColumnsType<API.RequestParamRemarkVO> = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '100px',
    },
    {
        title: '类型',
        dataIndex: 'type',
        width: '100px',
    },
    {
        title: '说明',
        dataIndex: 'remark',
    },
];
const Index: React.FC = () => {
    const [invokeLoading, setInvokeLoading] = useState(false);
    const [data, setData] = useState<API.InterfaceInfoVO>();
    const params = useParams();
    const [invokeRes, setInvokeRes] = useState<any>();
    const[imgUrl,setImgUrl] = useState<string>();



  const loadData = async () => {
        try {
            const interfaceInfoRes = await getInterfaceInfoVOByIdUsingGET({
                id: Number(params.id),
            });

            const interfaceInfoData = interfaceInfoRes.data;

            if (interfaceInfoData) {
                setData(interfaceInfoData);
            }
        } catch (error: any) {
            message.error('请求失败，' + error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onFinish = async (values: any) => {
      setInvokeRes('');
        console.log('values:', values);
        if (!params.id) {
            message.error('接口不存在');
            return;
        }
        setInvokeLoading(true);
      try {
        const res = await invokeInterfaceInfoUsingPOST({
          id: params.id,
          ...values,
        });
        if (res.data){
        setInvokeRes(res.data);
          // 提交完成后，刷新表格
        setImgUrl( (JSON.parse(res.data)).imgurl);
        message.success('请求成功');
        loadData();
        }
      } catch (error: any) {
        message.error('请求失败！' + error.message);
      }
      setInvokeLoading(false);
    };

    return (
        <PageContainer>
            <Card>
                {data ? (
                    <Descriptions title={data.name} column={4} layout={'vertical'}>
                        <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
                        <Descriptions.Item label="接口状态">
                            {data.status ? (
                                <Badge status="success" text={'开启'} />
                            ) : (
                                <Badge status="default" text={'关闭'} />
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
                        <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
                        <Descriptions.Item label="请求参数示例" span={4}>
                            {data.requestParam}
                        </Descriptions.Item>
                      <Descriptions.Item label="剩余调用次数" >
                        {data.leftNum}
                      </Descriptions.Item>
                      <Descriptions.Item label="总调用次数"  span={4}>
                        {data.totalNum}
                      </Descriptions.Item>
                        <Descriptions.Item label="请求参数说明" span={4}>
                            <Table
                                style={{ width: '100%' }}
                                pagination={{
                                    hideOnSinglePage: true,
                                }}
                                columns={requestColumns}
                                dataSource={data.requestParamRemark}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="响应参数说明" span={4}>
                            <Table
                                style={{ width: '100%' }}
                                pagination={{
                                    hideOnSinglePage: true,
                                }}
                                columns={responseColumns}
                                dataSource={data.responseParamRemark}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
                        <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间">
                            {moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <>接口不存在</>
                )}
            </Card>
            {data ? (
                <>
                    {' '}
                    <Divider />
                    <Card title={'在线测试'}>
                        <Form name="invoke" layout={'vertical'} onFinish={onFinish}>
                            <Form.Item
                                label={'请求参数'}
                                initialValue={data?.requestParam}
                                name={'requestParam'}
                            >
                                <Input.TextArea defaultValue={data?.requestParam} rows={6} />
                            </Form.Item>

                            <Form.Item wrapperCol={{ span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    调用
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Divider />
                    <Card title={'返回结果'} loading={invokeLoading}>
                        <Input.TextArea value={invokeRes} rows={8} />
                        <Image decoding='async'  width={Card.width} src={imgUrl}/>
                    </Card>
                </>
            ) : null}
        </PageContainer>
    );
};

export default Index;

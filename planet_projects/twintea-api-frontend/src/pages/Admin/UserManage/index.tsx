import {
  bannedAccountUsingGET,
  getUserManageDetailUsingGET,
  listUserByPageUsingPOST, restoredAccountUsingGET
} from '@/services/twintea-api-backend/adminUserController';
import {CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import type { ActionType,ProColumns } from '@ant-design/pro-components';
import {
  DrawerForm, PageContainer, ProFormInstance, ProFormText, ProTable
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Form, Image, message, Popconfirm, Tag, Tooltip} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {getLoginUserUsingGET} from "@/services/twintea-api-backend/userController";



const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [loginUser, setLoginUser] = useState<API.UserVO>({});
  const [interfaceUsageDataSource, setInterfaceUsageDataSource] = useState<
    API.UserInterfaceInfoUsageVO[]
  >([]);
  const formRef = useRef<ProFormInstance>();

  const getUserManageDetailVO = async (record: API.UserManageDetailVO) => {
    try {
      await getUserManageDetailUsingGET({
        id: record.id,
      }).then((res) => {
        if (res.data) {
          // setDetail(res.data);
          setInterfaceUsageDataSource(res.data.userInterfaceInfoUsageVO ?? []);
          formRef.current?.setFieldsValue(res.data);
        }
      });
    } catch (error: any) {
      message.error('获取详情数据失败，' + error.message);
    }
  };


  const getLoginUser = async () => {
    try {
      const  res =await getLoginUserUsingGET();
      if (res.code ===0){
        setLoginUser(res.data)
      }
    }catch (error: any){
      message.error(error.message);
    }
  }

  useEffect(()=>{
    getLoginUser()
  },[])

  /**
   *  Delete node
   * @zh-CN 封禁账号
   *
   * @param record
   */
  const handleBannedAccounts = async (record: API.UserManageVO) => {
    const hide = message.loading('正在封禁');
    if (!record) return true;
    try {
     const res = await bannedAccountUsingGET({
        id: record.id,
      });
      hide();
      if (res.code ===0 ){
      message.success('封禁成功');
      actionRef.current?.reload();
      return true;
      }
    } catch (error) {
      hide();
      message.error('封禁失败');
      return false;
    }
  };


  /**
   *  Delete node
   * @zh-CN 解封账号
   *
   * @param record
   */
  const handleRestoredAccounts = async (record: API.UserManageVO) => {
    const hide = message.loading('正在解封');
    if (!record) return true;
    try {
      const res = await restoredAccountUsingGET({
        id: record.id,
      });
      hide();
      if (res.code === 0){
        message.success('解封成功');
        actionRef.current?.reload();
        return true;
      }
    } catch (error) {
      hide();
      message.error('解封失败');
      return false;
    }
  };

  /**
   * table 展示的列
   * */
  const columns: ProColumns<API.UserManageVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
      hideInTable: true,
      fixed: 'left',
      width: 50,
    },
    {
      title: '用户昵称',
      dataIndex: 'userName',
      valueType: 'text',
      fixed: 'left',
      width: 100,
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      fixed: 'left',
      valueType: 'textarea',
      width: 100,
      // formItemProps: {
      //     rules: [
      //         {
      //             required: true,
      //         },
      //     ],
      // },
      render: (_, record) => {
        return loginUser.userRole === 'user' ? (
          <Tooltip title={'已隐藏敏感信息'}>{record.userAccount} </Tooltip>
        ) : (
          record.userAccount
        );
      },
    },
    {
      title: '用户IP地址',
      dataIndex: 'ip',
      valueType: 'text',
      render: (_, record) => {
        return loginUser.userRole === 'user' ? (
          <Tooltip title={'已隐藏敏感信息'}>{record.ip} </Tooltip>
        ) : (
          record.ip
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: 'ip归属地信息',
      dataIndex: 'ipAttribution',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '用户角色',
      dataIndex: 'userRole',
      valueType: 'select',
      valueEnum: { admin: 'admin', user: 'user' },
      render: (_, record) => {
        return record.userRole === 'admin' ? (
          <Tag color="#2db7f5">{record.userRole}</Tag>
        ) : (
          <Tag>{record.userRole}</Tag>
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },

    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      valueEnum: {
        0: {
          text: '男',
          status: 'Default',
        },
        1: {
          text: '女',
          status: 'Warning',
        },
      },
    },
    {
      title: '用户头像',
      dataIndex: 'userAvatar',
      hideInSearch: true,
      // valueType: 'text',
      render: (_, record) => {
        if (record.userAvatar) {
          return <Image src={record.userAvatar} width={50} height={50} />;
        } else {
          return (
            <div>
              <p>无头像</p>
            </div>
          );
        }
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '拥有接口',
      dataIndex: 'owedInterface',
      valueType: 'formList',
      width: 150,
      render: (_, record) => {
        const tags = [];
        let count = 0;
        for (let item of record.owedInterface) {
          tags.push(
            <Tag color={'blue'} key={item}>
              {item}
            </Tag>,
          );
          count++;
          if (count === 3) {
            break;
          }
        }
        if (record.owedInterface?.length > 3) {
          tags.push(
            <Tag color={'blue'} key={'more'}>
              等
            </Tag>,
          );
          return <Tooltip title={record.owedInterface?.join('、')}>{tags}</Tooltip>;
        } else {
          return tags;
        }
      },
    },
    {
      title: '用户状态',
      dataIndex: 'userStatus',
      filters: true,
      onFilter: true,
      valueEnum: {
        0: {
          text: '正常',
        },

        1: {
          text: '禁用',
        },
      },
      render: (_, record) => {
        return record.userStatus === 0 ? (
          <Tag icon={<CheckCircleOutlined />} color={'success'}>
            正常
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color={'error'}>
            禁用
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: {
        type: 'dateTime',
        format: 'yyyy年MM月dd日 HH:mm',
      },
      // hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: {
        type: 'dateTime',
        format: 'yyyy年MM月dd日 HH:mm',
      },

      // hideInForm: true,
      // hideInTable: true,
      hideInSearch: true,
    },

    {
      title: '创建时间范围',
      key: 'createTimeRange',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        // placeholder: []
      },
      renderFormItem: (_, { type, defaultRender }) => {
        if (type === 'form') {
          return null;
        }

        return defaultRender(_);
      },
    },
    {
      title: '更新时间范围',
      key: 'updateTimeRange',
      // dataIndex: 'updateTimeRange',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        // placeholder: []
      },
      renderFormItem: (_, { type, defaultRender }) => {
        if (type === 'form') {
          return null;
        }

        return defaultRender(_);
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return  record.userStatus === 1 ?
           [
              <Button
                type={"dashed"}
                key="detail"
                onClick={() => {
                  getUserManageDetailVO(record);
                  setShowDetail(true);
                  // setCurrentRow(record);
                  // setDetail(record);
                }}
              >
                详情
              </Button>,
            <Popconfirm
              title="解封该账号"
              description="请确认是否解封该账号?"
              key="banned"
              onConfirm={
                () => {
                  handleRestoredAccounts(record);
                }
              }
              okText="确认"
              cancelText="手滑了"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button type={"dashed"} danger>
                恢复
              </Button>
            </Popconfirm>,
            ]
          : [
              <Button
                key="detail"
                onClick={() => {
                  getUserManageDetailVO(record);
                  setShowDetail(true);
                  // setCurrentRow(record);
                }}
              >
                详情
              </Button>,
            <Popconfirm
              title= '封禁该账号'
              description="请确认是否封禁该账号?"
              key="banned"
              onConfirm={() => {
                handleBannedAccounts(record);
              }}
              okText="确认"
              cancelText="手滑了"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button danger>
                禁用
              </Button>
            </Popconfirm>,
            ];
      },
    },
  ];
  const interfaceUsageColumns: ProColumns<API.UserInterfaceInfoUsageVO>[] = [
    {
      title: '接口名称',
      dataIndex: 'interfaceName',
      width: '15%',
    },
    {
      title: '接口调用次数',
      dataIndex: 'totalNum',
      render: (_, record) => {
        return loginUser.userRole === 'user' ? (
          <Tooltip title={'已隐藏敏感信息'}>{'****'} </Tooltip>
        ) : (
          record.totalNum
        );
      },
    },
    {
      title: '接口剩余调用次数',
      dataIndex: 'leftNum',
      render: (_, record) => {
        return loginUser.userRole === 'user' ? (
          <Tooltip title={'已隐藏敏感信息'}>{'****'} </Tooltip>
        ) : (
          record.leftNum
        );
      },
    },
    {
      title: '接口状态',
      dataIndex: 'interfaceInfoStatus',
      valueEnum: {
        0: '关闭',
        1: '开启',
      },
    },
    {
      title: '调用接口状态',
      dataIndex: 'invokeStatus',
      valueEnum: {
        0: '正常',
        1: '禁用',
      },
    },
    {
      title: '申请接口的时间',
      dataIndex: 'createTime',
      valueType: {
        type: 'dateTime',
        format: 'yyyy年MM月dd日 HH:mm:ss',
      },
      render: (_, record) => {
        return loginUser.userRole === 'user' ? (
          <Tooltip title={'已隐藏敏感信息'}>{'****'} </Tooltip>
        ) : (
          record.createTime
        );
      },
    },
    {
      title: '最近调用时间',
      dataIndex: 'updateTime',
      valueType: {
        type: 'dateTime',
        format: 'yyyy年MM月dd日 HH:mm:ss',
      },
      render: (_, record) => {
        return loginUser.userRole === 'user' ? (
          <Tooltip title={'已隐藏敏感信息'}>{'****'} </Tooltip>
        ) : (
          record.updateTime
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.UserManageVO, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          console.log('---------->', params);
          const res = await listUserByPageUsingPOST({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records ?? [],
              success: true,
              total: res.data.total ?? 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        scroll={{ x: 1600 }}
      />
      <DrawerForm<API.UserManageDetailVO>
        formKey="show-modal-form"
        autoFocusFirstInput
        onOpenChange={setShowDetail}
        title="接口使用详情"
        open={showDetail}
        formRef={formRef}
      >
        <ProFormText name="userName"
                     label="用户昵称"
                      disabled  />
        <ProFormText
          name="userAccount"
          label="用户账户名称"
          disabled
        />
        <Form.Item name="userInterfaceInfoUsageVO" label="接口使用详情">
          <ProTable<API.UserInterfaceInfoUsageVO>
            rowKey="interface-usage-id"
            toolBarRender={false}
            columns={interfaceUsageColumns}
            dataSource={interfaceUsageDataSource}
            pagination={false}
            search={false}
          />
        </Form.Item>
      </DrawerForm>
    </PageContainer>
  );
};
export default TableList;

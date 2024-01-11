import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import ShowModal from '@/pages/Admin/InterfaceInfo/components/ShowModal';
import UpdateModal from '@/pages/Admin/InterfaceInfo/components/UpdateModal';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST,
  listInterfaceInfoVOByPageUsingPOST,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST
} from '@/services/twintea-api-backend/adminInterfaceInfoController'
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import initialState from "@@/plugin-initialState/@@initialState";

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showModalOpen, handleShowModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfoVO>();
  /**
   * 权限不足，按下按钮的反馈
   *
   */
  const handleNoAuthButtonResponse = async () => {
    message.error("无权限！");
  }


  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfoVO) => {
    const hide = message.loading('正在添加');
    try {
     const res =  await addInterfaceInfoUsingPOST({
        ...fields,
      });
     hide();
     if(res.code ===0){
       message.success('创建成功');
       handleModalOpen(false);
       actionRef.current?.reload();
       return true;
     }else {
       // message.error('创建失败，' + res?.message);
     }
    } catch (error: any) {
      hide();
      // message.error('创建失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfoVO) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      const res = await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields,
      });
      hide();
      if(res.code ===0){
      message.success('操作成功');
      return true;
      }else {
        // message.error('操作失败，' + res?.message);
      }
    } catch (error: any) {
      hide();
      // message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfoVO) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
    const res =  await deleteInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      if (res.code ===0){
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
      }else {
        // message.error('删除失败');
      }
    } catch (error) {
      hide();
      // message.error('删除失败');
      return false;
    }
  };

  /**
   *  发布接口
   *
   * @param IdRequest
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      const res = await onlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      if (res.code === 0) {
        message.success('发布成功');
        actionRef.current?.reload();
        return true;
      }else {
        // message.error('发布失败');
      }
    } catch (error) {
      hide();
      // message.error('发布失败');
      return false;
    }
  };

  /**
   *  下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
     const res = await offlineInterfaceInfoUsingPOST({
        id: record.id,
      });
      hide();
      if (res.code === 0){
        message.success('下线成功');
        actionRef.current?.reload();
      return true;
      }else {
        // message.error('下线失败');
      }
    } catch (error) {
      hide();
      message.error('下线失败');
      return false;
    }
  };

  /**
   * table 展示的列
   * */
  const columns: ProColumns<API.InterfaceInfoVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      valueType: 'index',
    },
    {
      title: '接口名称',
      dataIndex: 'name',
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
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
      valueEnum: {
        POST: 'POST',
        GET: 'GET',
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
      title: '接口地址',
      dataIndex: 'url',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '请求参数',
      dataIndex: 'requestParam',
      valueType: 'jsonCode',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
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
        return record.status === 0
          ? [
              <Button
                key="detail"
                onClick={() => {
                  handleShowModalOpen(true);
                  setCurrentRow(record);
                }}
              >
                详情
              </Button>,

              <Button
                key="update"
                onClick={() => {
                  handleUpdateModalOpen(true);
                  setCurrentRow(record);
                }}
              >
                修改
              </Button>,
              <Button
                key="online"
                onClick={() => {
                  handleOnline(record);
                }}
              >
                发布
              </Button>,
              <Button
                danger
                key="remove"
                onClick={() => {
                  handleRemove(record);
                }}
              >
                删除
              </Button>,
            ]
          : [
              <Button
                key="detail"
                onClick={() => {
                  handleShowModalOpen(true);
                  setCurrentRow(record);
                }}
              >
                详情
              </Button>,
              <Button
                key="update"
                onClick={() => {
                  handleUpdateModalOpen(true);
                  setCurrentRow(record);
                }}
              >
                修改
              </Button>,
              <Button
                key="online"
                onClick={() => {
                  handleOffline(record);
                }}
              >
                下线
              </Button>,
              <Popconfirm
                title="删除数据"
                key="remove"
                description="确认删除该数据吗？"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => {
                  handleRemove(record);
                }}
              >
                <Button danger>删除</Button>
              </Popconfirm>,
            ];
      },
    },
  ];

  const requestColumns: ProColumns<API.RequestParamRemarkVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '必填',
      key: 'isRequired',
      dataIndex: 'isRequired',
      valueType: 'select',
      valueEnum: {
        yes: {
          text: '是',
        },
        no: {
          text: '否',
        },
      },
      width: '15%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '15%',
    },
    {
      title: '说明',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '10%',
      render: () => {
        return null;
      },
    },
  ];
  const responseColumns: ProColumns<API.RequestParamRemarkVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '15%',
    },
    {
      title: '说明',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '10%',
      render: () => {
        return null;
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.InterfaceInfoVO, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={  initialState?.loginUser?.userRole === 'admin'?
             () => {
              handleModalOpen(true);
            }: handleNoAuthButtonResponse }
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          console.log('---------->', params);
          const res = await listInterfaceInfoVOByPageUsingPOST({
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
      />

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        setVisible={handleUpdateModalOpen}
        visible={updateModalOpen}
        values={currentRow ?? {}}
        requestColumns={requestColumns}
        responseColumns={responseColumns}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>

      <ShowModal
        setVisible={handleShowModalOpen}
        values={currentRow ?? {}}
        visible={showModalOpen}
        requestColumns={requestColumns}
        responseColumns={responseColumns}
      />

      <CreateModal
        columns={columns}
        setVisible={handleModalOpen}
        onSubmit={(values) => {
          return handleAdd(values).then((r) => {});
        }}
        visible={createModalOpen}
        requestColumns={requestColumns}
        responseColumns={responseColumns}
      />
    </PageContainer>
  );
};
export default TableList;

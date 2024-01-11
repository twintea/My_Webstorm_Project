import { DrawerForm, ProColumns, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-table';
import '@umijs/max';
import { Form, Input } from 'antd';
import React, { useRef, useState } from 'react';

export type FormValueType = {
    target?: string;
    template?: string;
    type?: string;
    time?: string;
    frequency?: string;
} & Partial<API.RuleListItem>;

export type Props = {
    columns: ProColumns<API.InterfaceInfoVO>[];
    setVisible: (visible: boolean) => void;
    onSubmit: (values: API.InterfaceInfoVO) => Promise<void>;
    visible: boolean;
    requestColumns: ProColumns<API.RequestParamRemarkVO>[];
    responseColumns: ProColumns<API.RequestParamRemarkVO>[];
};

const CreateModal: React.FC<Props> = (props) => {
    const { visible, setVisible, onSubmit, requestColumns, responseColumns } = props;
    const formRef = useRef<ProFormInstance>();
    // @ts-ignore
    const [requestEditableKeys, setRequestEditableKeys] = useState<React.Key[]>(() => []);
    const [requestDataSource, setRequestDataSource] = useState<
        readonly API.RequestParamRemarkVO[]
    >([]);
    // @ts-ignore
    const [responseEditableKeys, setResponseEditableKeys] = useState<React.Key[]>(() => []);
    const [responseDataSource, setResponseDataSource] = useState<
        readonly API.ResponseParamRemarkVO[]
    >([]);
    return (
        <DrawerForm<API.InterfaceInfoVO>
            onFinish={async (value) => {
                console.log('---------->', value);
                onSubmit?.(value);
            }}
            formRef={formRef}
            formKey="update-modal-form"
            autoFocusFirstInput
            onOpenChange={setVisible}
            title="新增接口"
            open={visible}
        >
            <ProFormText
                name="name"
                label="接口名称"
                rules={[{ required: true, message: '接口名称不可为空！' }]}
            />

            <ProFormText
                name="description"
                label="描述"
                rules={[{ required: true, message: '描述不可为空！' }]}
            />
            <ProFormText
                name="method"
                label="请求方法"
                rules={[{ required: true, message: '请求方法不可为空！' }]}
            />

            {/*<ProFormText*/}
            {/*    name="host"*/}
            {/*    label="主机名"*/}
            {/*    rules={[{ required: true, message: '主机名不可为空！' }]}*/}
            {/*/>*/}
            <ProFormText
                name="url"
                label="接口地址"
                rules={[{ required: true, message: '接口地址不可为空！' }]}
            />
            <Form.Item name="requestParam" label="请求参数示例">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="requestParamRemark" label="请求参数说明">
                <EditableProTable<API.RequestParamRemarkVO>
                    rowKey="id"
                    toolBarRender={false}
                    columns={requestColumns}
                    value={requestDataSource}
                    onChange={setRequestDataSource}
                    recordCreatorProps={{
                        newRecordType: 'dataSource',
                        position: 'bottom',
                        record: () => ({
                            id: Date.now(),
                            isRequired: 'no',
                            type: 'string',
                        }),
                    }}
                    editable={{
                        type: 'multiple',
                        editableKeys: requestEditableKeys,
                        onChange: setRequestEditableKeys,
                        actionRender: (row, _, dom) => {
                            return [dom.delete];
                        },
                        onValuesChange: (record, recordList) => {
                            setRequestDataSource(recordList);
                            formRef.current?.setFieldsValue({
                                requestParamRemark: recordList,
                            });
                        },
                    }}
                />
            </Form.Item>

            <Form.Item name="responseParamRemark" label="响应参数说明">
                <EditableProTable<API.ResponseParamRemarkVO>
                    rowKey="id"
                    toolBarRender={false}
                    columns={responseColumns}
                    value={responseDataSource}
                    onChange={setResponseDataSource}
                    recordCreatorProps={{
                        newRecordType: 'dataSource',
                        position: 'bottom',
                        record: () => ({
                            id: Date.now(),
                            type: 'string',
                        }),
                    }}
                    editable={{
                        type: 'multiple',
                        editableKeys: responseEditableKeys,
                        onChange: setResponseEditableKeys,
                        actionRender: (row, _, dom) => {
                            return [dom.delete];
                        },
                        onValuesChange: (record, recordList) => {
                            setResponseDataSource(recordList);
                            formRef.current?.setFieldsValue({
                                responseParamRemark: recordList,
                            });
                        },
                    }}
                />
            </Form.Item>
            <Form.Item name="requestHeader" label="请求头">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="responseHeader" label="响应头">
                <Input.TextArea />
            </Form.Item>
        </DrawerForm>
    );
};
export default CreateModal;

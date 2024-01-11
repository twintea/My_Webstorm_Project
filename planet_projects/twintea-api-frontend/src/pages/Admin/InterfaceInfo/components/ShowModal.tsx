import {
    DrawerForm,
    ProColumns,
    ProFormInstance,
    ProFormText,
    ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Form, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export type Props = {
    values: API.InterfaceInfoVO;
    setVisible: (visible: boolean) => void;
    visible: boolean;
    requestColumns: ProColumns<API.RequestParamRemarkVO>[];
    responseColumns: ProColumns<API.RequestParamRemarkVO>[];
};

const ShowModal: React.FC<Props> = (props) => {
    const { values, setVisible, visible, responseColumns, requestColumns } = props;
    const formRef = useRef<ProFormInstance>();
    const [responseDataSource, setResponseDataSource] = useState<
        readonly API.ResponseParamRemarkVO[]
    >(() => values.responseParamRemark || []);
    const [requestDataSource, setRequestDataSource] = useState<
        readonly API.RequestParamRemarkVO[]
    >(() => values.requestParamRemark || []);

    useEffect(() => {
        setRequestDataSource(values.requestParamRemark || []);
        setResponseDataSource(values.responseParamRemark || []);
        formRef.current?.setFieldsValue(values);
    }, [values]);
    return (
        <DrawerForm<API.InterfaceInfoVO>
            formRef={formRef}
            formKey="update-modal-form"
            autoFocusFirstInput
            onOpenChange={setVisible}
            title="查看接口"
            open={visible}
        >
            <ProFormText name="name" label="接口名称" initialValue={values.name} disabled />

            <ProFormText
                name="description"
                label="描述"
                initialValue={values.description}
                disabled
            />
            <ProFormText name="method" label="请求方法" initialValue={values.method} disabled />

            {/*<ProFormText name="host" label="主机名" initialValue={values.host} disabled />*/}
            <ProFormText name="url" label="接口地址" initialValue={values.url} disabled />
            <Form.Item name="requestParam" label="请求参数示例">
                <Input.TextArea defaultValue={values.requestParam} disabled />
            </Form.Item>
            <Form.Item name="requestParamRemark" label="请求参数说明">
                <ProTable<API.RequestParamRemarkVO>
                    rowKey="id"
                    toolBarRender={false}
                    columns={requestColumns}
                    dataSource={requestDataSource}
                    pagination={false}
                    search={false}
                />
            </Form.Item>

            <Form.Item name="responseParamRemark" label="响应参数说明">
                <ProTable<API.ResponseParamRemarkVO>
                    rowKey="id"
                    toolBarRender={false}
                    columns={responseColumns}
                    dataSource={responseDataSource}
                    pagination={false}
                    search={false}
                />
            </Form.Item>
            <Form.Item name="requestHeader" label="请求头">
                <Input.TextArea defaultValue={values.requestHeader} disabled />
            </Form.Item>
            <Form.Item name="responseHeader" label="响应头">
                <Input.TextArea defaultValue={values.responseHeader} disabled />
            </Form.Item>
        </DrawerForm>
    );
};
export default ShowModal;

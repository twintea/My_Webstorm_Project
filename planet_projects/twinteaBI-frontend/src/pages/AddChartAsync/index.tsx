import { genChartByAIAsyncUsingPOST } from '@/services/twintea-BI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-form';
import { Button, Input, message, Select, Space, Upload } from 'antd';
import Card from 'antd/es/card/Card';
import TextArea from 'antd/es/input/TextArea';
import { Form } from 'antd/lib';
import { useState } from 'react';
import useForm = ProForm.useForm;

const AddChartAsync: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();

  const onFinish = async (values: any) => {
    //避免重复提交
    if (loading) {
      return;
    }

    setLoading(true);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAIAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
    }

    setLoading(false);
  };

  return (
    <div className="add-chart-async">
      <Card title="智能分析">
        <Form
          name="addChart"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '请输入分析目标' }]}
          >
            <TextArea
              // value={value}
              // onChange={(e) => setValue(e.target.value)}
              placeholder="请输入分析目标，比如： 分析网站的用户增长情况"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item name="chartName" label="图表名称">
            <Input
              // value={value}
              // onChange={(e) => setValue(e.target.value)}
              placeholder="请输入图表名称"
            />
          </Form.Item>

          <Form.Item
            name="chartType"
            label="图表类型"
            hasFeedback
            rules={[{ required: true, message: 'Please select your country!' }]}
          >
            <Select
              placeholder="请选择图表类型"
              options={[
                { value: '折线图', label: '折线图' },
                { value: '柱状图', label: '柱状图' },
                { value: '饼图', label: '饼图' },
                { value: '堆叠图', label: '堆叠图' },
                { value: '雷达图', label: '雷达图' },
              ]}
            />
          </Form.Item>

          <Form.Item name="file" label="原始数据">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                智能分析
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;

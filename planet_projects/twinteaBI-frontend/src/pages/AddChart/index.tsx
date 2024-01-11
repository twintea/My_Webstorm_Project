import { genChartByAIUsingPOST } from '@/services/twintea-BI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, message, Row, Select, Space, Spin, Upload } from 'antd';
import Card from 'antd/es/card/Card';
import TextArea from 'antd/es/input/TextArea';
import { Form } from 'antd/lib';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';

const AddChart: React.FC = () => {
  const [data, setData] = useState<API.BIResponse>();
  const [loading, setLoading] = useState(false);
  const [genChartData, setGenChartData] = useState<any>();

  const onFinish = async (values: any) => {
    //避免重复提交
    if (loading) {
      return;
    }
    //清空数据
    setData(undefined);
    setGenChartData(undefined);

    setLoading(true);
    const params = {
      ...values,
      file: undefined,
    };
    let res = null;
    try {
      //注意 取到 真实的文件源
      res = await genChartByAIUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(res.data);
      if (res.data) {
        const chartOption = JSON.parse(res.data.genData ?? '').option;
        console.log('图表数据' + chartOption);
        if (!chartOption) {
          console.log('程序判断 chartOption为空');
          throw new Error('图表解析错误');
        } else {
          setData(res.data);
          setGenChartData(chartOption);
        }
        message.success('分析成功');
      } else {
        message.error('分析失败,' + res?.message);
      }
    } catch (error: any) {
      message.error('分析失败,' + res?.message);
    }
    setLoading(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
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
        </Col>
        <Col span={12}>
          <Card title="分析结论">
            {data?.genResult ?? <div>请先在左侧进行提交</div>}
            <Spin spinning={loading} />
          </Card>
          <Divider />
          <Card title="可视化图表">
            {genChartData ? <ReactECharts option={genChartData} /> : <div>请先在左侧进行提交</div>}
            <Spin spinning={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;

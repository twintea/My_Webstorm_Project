import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";
import ReactECharts from 'echarts-for-react';
import {showPopularInterfaceUsingGET} from "@/services/twintea-api-backend/statisticAnalysisController";
import {message} from "antd";
const StatisticAnalysis: React.FC = () => {
  const [data, setData] = useState<API.PopInterfaceInfoVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    try {
      showPopularInterfaceUsingGET().then(res=>{
        if (res.data){
          setData(res.data);
          setLoading(false);
        }
      })
    }catch (e:any){
      message.error('请求失败，' + e.message);
    }
  },[])

  const charData= data.map(item => {
    return{
      value: item.totalNum,
      name: item.name,
    }
  })

  const options = {
    title: {
      text: 'Top8热门接口',
      left: 'center',
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        // name:
        type: 'pie',
        radius: '50%',
        data:charData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return(
    <PageContainer >
      <div >
      <ReactECharts  showLoading={loading} option={options} />
      </div>
    </PageContainer>
  );
};

export default StatisticAnalysis;

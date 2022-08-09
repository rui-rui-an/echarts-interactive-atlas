const Mock = require('mockjs');

// 2、获取 mock.Random 对象
// const random = Mock.Random;
// console.log(random); // 简单使用就不操作了，需要操作的可以去看文档
import asyncdata from './data'
import tableData from './tableData'
import editData from './editData'


// 3、基本用法 Mock.mock(url, type, data) // 参数文档 https://github.com/nuysoft/Mock/wiki
Mock.mock('/echarts/humanrelation', 'get', {
  code: 200,
  message: '成功',
  data: asyncdata
});

Mock.mock('/echarts/aboutrelation', 'get', {
  code: 200,
  message: '成功',
  data: tableData
});

Mock.mock('/echarts/editrelation', 'get', {
  code: 200,
  message: '成功',
  data: editData
});
import http from '@/libs/http';

/**
 * 模拟取消请求
 * @param params 查询参数
 * @param cancelToken 取消 token
 * @return {Promise}
 */
export function getArticles(params, cancelToken) {
  return http.get('articles', { params, cancelToken });
}

const data = [
  { key: '15', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '21', name: 'Joe Black', age: 42, address: 'London No. 1 Lake Park' },
  { key: '8', name: 'Jim Green', age: 32, address: 'Sidney No. 1 Lake Park' },
  { key: '13', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
  { key: '62', name: 'Jim Red', age: 32, address: 'New York No. 2 Lake Park' },
  { key: '48', name: 'Jim Red', age: 32, address: 'London No. 3 Lake Park' },
  { key: '23', name: 'Jim Red', age: 32, address: 'London No. 4 Lake Park' },
  { key: '34', name: 'Jim Red', age: 32, address: 'London No. 5 Lake Park' },
  { key: '51', name: 'Jim Red', age: 32, address: 'London No. 6 Lake Park' },
];

/**
 * 模拟表格接口返回值
 * @param params 查询参数，
 * @return {Promise<{data: *[], meta: {total: number}}>}
 */
export function getTableData(params) {
  const start = (params.page - 1) * params.pageSize;
  return Promise.resolve({
    data: data.slice(start, start + params.pageSize),
    meta: {
      total: data.length,
    },
  });
}

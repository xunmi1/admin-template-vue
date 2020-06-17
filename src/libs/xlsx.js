import { utils, writeFile } from 'xlsx';

// DOM table 元素导出 xlsx
export function tableToXlsx(selectors, fileName) {
  const table = document.querySelector(selectors);
  const wb = utils.table_to_book(table);
  writeFile(wb, fileName);
}

// 标准表格数据导出, 即 title 和 data 数据格式一致(键值对数组)
export function jsonToXlsx({ key, data, title, fileName }) {
  const wb = utils.book_new();
  data.unshift(title);
  const ws = utils.json_to_sheet(data, { header: key, skipHeader: true });
  const arr = getValues(key, data);
  autoWidth(ws, arr);
  utils.book_append_sheet(wb, ws, fileName);
  writeFile(wb, fileName + '.xlsx');
}

/**
 * 组件 table 数据导出
 * @param {Object[]} dataSource - 数据数组
 * @param {Object[]} columns - 列描述数据对象
 * @param {string} [fileName=Date.now()] - 文件名
 */
export function toXlsx({ dataSource, columns, fileName = String(Date.now()) }) {
  const { key, title } = columns.reduce(
    (obj, value) => {
      obj.key.push(value.key ?? value.dataIndex);
      obj.title.push(value.title);
      return obj;
    },
    { key: [], title: [] }
  );
  const workBook = utils.book_new();
  const data = getValues(key, dataSource);
  data.unshift(title);
  const workSheet = utils.aoa_to_sheet(data);
  autoWidth(workSheet, data);
  utils.book_append_sheet(workBook, workSheet, fileName);
  writeFile(workBook, fileName + '.xlsx');
}

function autoWidth(workSheet, data) {
  const widthList = data.map(row =>
    row.map(val => {
      const str = String(val ?? '');
      /* if chinese */
      const ch = str.match(/\p{Unified_Ideograph}/gu)?.length ?? 0;
      return Math.max(str.length + 4, 8) + ch;
    })
  );
  // 计算每列最大宽度
  workSheet['!cols'] = widthList[0].map((_, i) => ({ wch: Math.max(...widthList.map(v => v[i])) }));
}

function getValues(keys, jsonData) {
  return jsonData.map(v => keys.map(key => v[key]));
}

import XLSX from 'xlsx';

function autoWidth (ws, data) {
    /*set worksheet max width per col*/
    const colWidth = data.map(row => row.map(val => {
        /*if null/undefined*/
        if (val == null) {
            return { 'wch': 10 };
        }
        /*if chinese*/
        else if (val.toString().charCodeAt(0) > 255) {
            return { 'wch': val.toString().length * 2 };
        } else {
            return { 'wch': val.toString().length };
        }
    }));
    /*start in the first row*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
        for (let j = 0; j < colWidth[i].length; j++) {
            if (result[j].wch < colWidth[i][j].wch) {
                result[j].wch = colWidth[i][j].wch;
            }
        }
    }
    ws['!cols'] = result;
}

function getValues (keys, jsonData) {
    return jsonData.map(v => keys.map(key => v[key]));
}

// get head from excel file,return array
function getHeaderRow (sheet) {
    const headers = [];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    let C;
    const R = range.s.r; /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        let cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
    }
    return headers;
}

// DOM table 元素导出 xlsx
export function tableToXlsx (selectors, filename) {
    const table = document.querySelector(selectors);
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, filename);
}

// 标准表格数据导出, 即 title 和 data 数据格式一致(键值对数组)
export function jsonToXlsx ({ key, data, title, filename }) {
    const wb = XLSX.utils.book_new();
    data.unshift(title);
    const ws = XLSX.utils.json_to_sheet(data, { header: key, skipHeader: true });
    const arr = getValues(key, data);
    autoWidth(ws, arr);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

/**
 * 组件 table 数据导出
 * @param {Object[]} dataSource - 数据数组
 * @param {Object[]} columns - 列描述数据对象
 * @param {string} filename - 文件名
 */
export function toXlsx ({ dataSource, columns, filename }) {
    const { key, title } = columns.map(i => ({ key: i.dataIndex, title: i.title }));
    const wb = XLSX.utils.book_new();
    const arr = getValues(key, dataSource);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    autoWidth(ws, arr);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

/**
 * 读取 xlsx 文件
 * @param data
 * @param type
 * @return {{header: Array, results: any[] | any[][]}}
 */
export function read (data, type) {
    const workbook = XLSX.read(data, { type });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const header = getHeaderRow(worksheet);
    const results = XLSX.utils.sheet_to_json(worksheet);
    return { header, results };
}

import XLSX from 'xlsx';

function autoWidth (ws, data) {
    const colWidth = data.map(row => row.map(val => {
        const _val = String(val);
        if (!_val) return { wch: 10 };
        /*if chinese*/
        const length = (_val.match(/[\u3220-\uFA29]/g) || []).length;
        return { wch: _val.length + length };
    }));
    /*start in the first row*/
    ws['!cols'] = colWidth[0].map((col, index) => ({ wch: Math.max(...colWidth.map(i => i[index].wch)) }));
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
export function tableToXlsx (selectors, fileName) {
    const table = document.querySelector(selectors);
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, fileName);
}

// 标准表格数据导出, 即 title 和 data 数据格式一致(键值对数组)
export function jsonToXlsx ({ key, data, title, fileName }) {
    const wb = XLSX.utils.book_new();
    data.unshift(title);
    const ws = XLSX.utils.json_to_sheet(data, { header: key, skipHeader: true });
    const arr = getValues(key, data);
    autoWidth(ws, arr);
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, fileName + '.xlsx');
}

/**
 * 组件 table 数据导出
 * @param {Object[]} dataSource - 数据数组
 * @param {Object[]} columns - 列描述数据对象
 * @param {string} [fileName=Date.now()] - 文件名
 */
export function toXlsx ({ dataSource, columns, fileName = String(Date.now()) }) {
    const { key, title } = columns.reduce((obj, value) => {
        obj.key.push(value.key || value.dataIndex);
        obj.title.push(value.title);
        return obj;
    }, { key: [], title: [] });
    const wb = XLSX.utils.book_new();
    const arr = getValues(key, dataSource);
    arr.unshift(title);
    const ws = XLSX.utils.aoa_to_sheet(arr);
    autoWidth(ws, arr);
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, fileName + '.xlsx');
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
    return {
        header: getHeaderRow(worksheet),
        results: XLSX.utils.sheet_to_json(worksheet),
    };
}

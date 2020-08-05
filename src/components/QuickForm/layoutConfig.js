export function getDefaultRow(mode) {
  const config = {
    horizontal: {
      type: 'flex',
      justify: 'start',
    },
    inline: {
      type: 'flex',
      justify: 'start',
      gutter: { sm: 24 },
    },
    vertical: {
      type: 'flex',
      justify: 'start',
      gutter: { xs: 16, sm: 24, md: 32, xxl: 40 },
    },
  };
  return config[mode];
}

export function getDefaultCol(mode, fields) {
  const length = fields.length;
  const config = {
    horizontal: { xs: 24 },
    inline: { xs: 24, sm: 12, md: 12, lg: 8, xl: length === 3 ? 6 : 8, xxl: length === 4 ? 5 : 6 },
    vertical: { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6 },
  };
  return config[mode];
}

export function getDefaultLayout(mode) {
  const config = {
    horizontal: {
      labelCol: { sm: 5, lg: 4 },
      wrapperCol: { sm: 19, lg: 20 },
    },
    inline: {
      labelCol: { sm: 7 },
      wrapperCol: { sm: 17 },
    },
    vertical: {
      labelCol: {},
      wrapperCol: {},
    },
  };
  return config[mode];
}

export function getSubmitLayout(layout) {
  const wrapperCol = Object.entries(layout.labelCol).reduce((obj, [key, value]) => {
    obj[key] = { offset: value };
    return obj;
  }, {});
  return { wrapperCol };
}

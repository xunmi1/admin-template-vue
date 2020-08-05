export const BAN_SLOTS = ['search', 'submit'];

export const TAG_DEFAULT = 'span';

export const TAG_MAP = {
  ASelect: 'FormSelect',
  ARadioGroup: 'FormRadio',
  ACascader: 'FormCascader',
};

// 默认的 `decorator`
export const FIELD_DECORATORS = {
  // 修改 `ARadioGroup` 收集值的时机为 `input`
  // 原 `change` 事件对于在使用 `ARadioButton` 时会失效，原因是 `change` 传递的是 `Event` 对象实例，并非子选项的值
  ARadioGroup: { trigger: 'input', validateTrigger: 'input' },
};

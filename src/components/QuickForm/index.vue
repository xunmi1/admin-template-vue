<template>
  <AForm
    :form="formContext"
    :layout="ownLayout"
    class="quick-form"
    :class="{ 'quick-form-inline': ownLayout === 'inline' }"
    @submit.prevent="submitHandler"
  >
    <ARow v-bind="ownRow">
      <template v-for="item in ownFields">
        <ACol :key="item.key" v-bind="item.col">
          <AFormItem
            :label="item.label"
            v-bind="item.layout"
            :data-form-key="item.key"
            :class="[{ 'quick-form-item-inline': ownLayout === 'inline' }, 'quick-form-item']"
          >
            <template v-if="item.slot">
              <slot :name="item.slot" :decorator="getDecorator(item.key)" :attrs="item.attrs" />
            </template>
            <template v-else-if="!item._IS_NATIVE">
              <Component
                :is="item._IS_RENDER ? 'FormRender' : item.tag"
                :key="item.key + '-component'"
                v-decorator="getDecorator(item.key)"
                :tag="item._IS_RENDER ? item.tag : undefined"
                :size="(item.attrs ? item.attrs.size : undefined) || size"
                v-bind="item.attrs"
                v-on="item.on"
              />
            </template>
            <template v-else>
              <NativeRender
                :key="item.key + '-native'"
                :tag="item.tag"
                :value="ownDecorators[item.key].initialValue"
                class="native-reset"
                v-bind="item.attrs"
                v-on="item.on"
              />
            </template>
          </AFormItem>
        </ACol>
      </template>
      <slot />
      <ACol v-if="($listeners.submit || $scopedSlots.search) && ownLayout === 'inline'">
        <AFormItem class="quick-form-item-inline quick-form-item">
          <slot name="search">
            <AButtonGroup :size="size">
              <AButton v-if="$listeners.reset" icon="reload" @click="reset">重置</AButton>
              <AButton v-if="$listeners.submit" type="primary" icon="search" html-type="submit">查询</AButton>
            </AButtonGroup>
          </slot>
        </AFormItem>
      </ACol>
    </ARow>
    <template v-if="($listeners.submit || $scopedSlots.submit) && ownLayout !== 'inline'">
      <AFormItem v-bind="submitLayout" class="quick-form-action">
        <slot name="submit">
          <AButton v-if="$listeners.cancel" :size="size" icon="undo" @click="cancel">
            {{ cancelText }}
          </AButton>
          <AButton
            v-if="$listeners.submit"
            :size="size"
            type="primary"
            icon="check"
            html-type="submit"
            :loading="loading"
          >
            {{ submitText }}
          </AButton>
        </slot>
      </AFormItem>
    </template>
  </AForm>
</template>

<script>
import { BAN_SLOTS, FIELD_DECORATORS, TAG_DEFAULT, TAG_MAP } from './constants';
import { getDefaultCol, getDefaultLayout, getDefaultRow, getSubmitLayout } from './layoutConfig';
import { deepMerge, equal, isNative, createValidateAsync, resetEmptyStr } from './utils';

export default {
  name: 'QuickForm',
  components: {
    FormSelect: () => import(/* webpackChunkName: "FormSelect" */ './extend/FormSelect'),
    FormRadio: () => import(/* webpackChunkName: "FormRadio" */ './extend/FormRadio'),
    FormCascader: () => import(/* webpackChunkName: "FormCascader" */ './extend/FormCascader'),
    FormRender: () => import(/* webpackChunkName: "FormRender" */ './extend/FormRender'),
    NativeRender: () => import(/* webpackChunkName: "NativeRender" */ './extend/NativeRender'),
  },
  props: {
    value: Object,
    createOptions: Object,
    layout: {
      type: String,
      validator: value => ['horizontal', 'vertical', 'inline'].includes(value),
    },
    fields: {
      type: Array,
      default: () => [],
    },
    decorators: Object,
    // 表单组件外围响应式宽度设置
    fieldsCol: [Object, Number],
    // 标签和组件的响应式宽度设置
    fieldsLayout: Object,
    // row 布局设置
    row: Object,
    size: {
      type: String,
      validator: value => ['default', 'large', 'small'].includes(value),
      default: 'default',
    },
    // 取消按钮文字
    cancelText: {
      type: String,
      default: '取消',
    },
    // 提交按钮文字
    submitText: {
      type: String,
      default: '提交',
    },
    loading: Boolean,
  },
  data() {
    return {
      ownDecorators: {},
    };
  },
  computed: {
    ownLayout() {
      return this.layout || (this.$listeners.reset && 'inline') || 'horizontal';
    },
    ownRow() {
      return Object.assign({}, getDefaultRow(this.ownLayout), this.row);
    },
    ownFields() {
      const commonCol = this.commonCol;
      const commonLayout = this.commonLayout;
      return this.fields.map(item => {
        const col = initCol(item.col, commonCol);
        const layout = initLayout(item, commonLayout, this.layout);
        const tag = initFieldTag(item.tag);
        const meta = initFieldMeta(tag);
        initFieldSlot(item);
        return { ...item, col, layout, tag, ...meta };
      });
    },

    commonLayout() {
      const defaultLayout = getDefaultLayout(this.ownLayout);
      return deepMerge(defaultLayout, { ...this.fieldsLayout });
    },
    commonCol() {
      const defaultCol = getDefaultCol(this.ownLayout, this.fields);
      if (typeof this.fieldsCol === 'number') return { span: this.fieldsCol };
      return Object.assign({}, defaultCol, this.fieldsCol);
    },
    submitLayout() {
      return getSubmitLayout(this.commonLayout);
    },
  },
  watch: {
    value: {
      handler(newVal) {
        if (equal(newVal, this.cacheValue)) return;
        this.cacheValue = { ...newVal };
        this.$nextTick(() => this.formContext._setValue(newVal));
      },
      deep: true,
    },
    fields() {
      this.ownDecorators = this.getOwnDecorators();
    },
    decorators: {
      handler() {
        this.ownDecorators = this.getOwnDecorators();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.formContext = this.createFormContext();
    this.formContext._setValue(this.value, true);
    this.cacheValue = { ...this.value };
  },
  methods: {
    createFormContext() {
      const createOptions = this.createOptions || {};
      const proxyEvent = (eventName, handler) => (...rest) => {
        if (handler) handler(...rest);
        this.$emit(eventName, ...rest);
      };
      const options = {
        ...createOptions,
        onValuesChange: proxyEvent('change-values', createOptions.onValuesChange),
        onFieldsChange: proxyEvent('change-fields', createOptions.onFieldsChange),
      };
      const formContext = proxyForm.call(this, this.$form.createForm(this, options));
      this.$emit('get-form', formContext);
      return formContext;
    },
    getDecorator(key) {
      const decorator = this.ownDecorators[key];
      return decorator ? [key, decorator] : [key];
    },
    getOwnDecorators() {
      const decorators = this.decorators || {};
      return this.fields.reduce((obj, field) => {
        const defaultDecorator = FIELD_DECORATORS[field.tag];
        const key = field.key;
        const userDecorator = decorators[key];
        const newDecorator = Array.isArray(userDecorator) ? { rules: userDecorator } : userDecorator;
        const oldDecorator = this.ownDecorators[key];
        obj[key] = { ...defaultDecorator, initialValue: undefined, ...oldDecorator, ...newDecorator };
        return obj;
      }, Object.create(null));
    },
    submitHandler() {
      this.$emit('update:loading', true);
      if (this.decorators) this.submitWithValidate();
      else this.submit();
    },
    submitWithValidate() {
      this.formContext.validateFieldsAndScroll((error, values) => {
        if (error) {
          this.$emit('error', error, values);
          this.$emit('update:loading', false);
        } else {
          this.$emit('submit', resetEmptyStr(values));
        }
      });
    },
    submit() {
      const values = this.formContext.getFieldsValue();
      this.$emit('submit', resetEmptyStr(values));
    },
    reset() {
      this.formContext.resetFields();
      this.$emit('reset', this.formContext.getFieldsValue());
    },
    cancel() {
      this.$emit('cancel', this.formContext.getFieldsValue());
    },
  },
};

const initCol = function (col, commonCol) {
  return Object.assign({}, commonCol, typeof col === 'number' ? { span: col } : col);
};

const initLayout = function (item, commonLayout, layout) {
  if (layout === 'vertical') return commonLayout;
  // 如果没有 label，则默认输入组件占满
  const _layout = item.label ? commonLayout : { wrapperCol: { xs: 24 } };
  return deepMerge(_layout, item.layout);
};

const initFieldTag = function (tag) {
  return tag ? TAG_MAP[tag] || tag : TAG_DEFAULT;
};

const initFieldSlot = function (item) {
  if (process.env.NODE_ENV !== 'production' && BAN_SLOTS.includes(item.slot)) {
    // eslint-disable-next-line no-console
    console.error(`The slot '${name}' have been banned, and you need to use the other named slot!`);
  }
  return item;
};

const initFieldMeta = function (tag) {
  const _IS_NATIVE = tag != null ? isNative(tag) : true;
  const _IS_RENDER = _IS_NATIVE ? false : typeof tag !== 'string';
  return { _IS_NATIVE, _IS_RENDER };
};

// 代理 formContext 对象
const proxyForm = function (ctx) {
  const { setFieldsValue, resetFields, validateFields, validateFieldsAndScroll } = ctx;
  // 增加 _setValue 方法(内部使用)
  ctx._setValue = (params, isInit = false) => {
    if (params == null) return;
    const _value = this.ownFields.reduce((total, item) => {
      // 如果是原生标签或者第一次设置表单值
      if (item._IS_NATIVE || isInit) {
        this.ownDecorators[item.key].initialValue = params[item.key];
      }
      total[item.key] = params[item.key];
      return total;
    }, Object.create(null));

    if (isInit) return;
    setFieldsValue.call(ctx, _value);
  };

  ctx.resetFields = keys => {
    resetFields.call(ctx, keys);
    this.cacheValue = {};
  };
  /** 异步 `validateFields`
   * @param [fieldNames]
   * @param [options]
   * @return {Promise<*>}
   */
  ctx.validateFieldsAsync = createValidateAsync(validateFields);
  ctx.validateFieldsAndScrollAsync = createValidateAsync(validateFieldsAndScroll);

  return ctx;
};
</script>

<style lang="less" scoped>
.native-reset {
  display: inline-block;
  line-height: 1.5;
  word-wrap: break-word;
}

.quick-form-inline {
  margin-top: -16px;

  .quick-form-item {
    width: 100%;
  }

  .quick-form-item-inline {
    margin-top: 16px;
  }

  /deep/ .quick-form-item-inline.ant-form-item-with-help {
    margin-bottom: -16px;

    .ant-form-explain {
      line-height: 18px;
    }
  }
}

.quick-form-action {
  .ant-btn + .ant-btn {
    margin-left: 16px;
  }
}

.quick-form {
  /* 优化 label 太长出现多行的情况 */

  /deep/ .ant-form-item-label {
    padding-right: 10px;

    &::after {
      content: ':';
      position: absolute;
      bottom: 0;
      margin: 0 8px 0 2px;
      color: rgba(0, 0, 0, 0.85);
    }

    > label {
      white-space: normal;
      .native-reset;

      &::after {
        content: none;
      }
    }
  }

  /deep/ .ant-form-item-children {
    /* 修复时间类组件长度未占满 */

    .ant-calendar-picker {
      width: 100%;
      max-width: 360px;
    }
  }
}
</style>

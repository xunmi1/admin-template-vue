<template>
  <div>
    <header class="header v-center">
      <img v-if="$app.logoPath" v-once :src="publicPath + $app.logoPath" alt="logo" height="46" class="header-logo" />
      <h1 class="header-title v-to-zero">{{ title }}</h1>
    </header>
    <main>
      <AForm :form="loginForm" class="login-form" @submit.prevent="login">
        <AFormItem>
          <AInput
            v-decorator="getRules('username')"
            placeholder="用户名:"
            size="large"
            @pressEnter.prevent="setPasswordFocus(true)"
            @focus="setPasswordFocus(false)"
          >
            <AIcon slot="prefix" type="user" class="login-form-icon" />
          </AInput>
        </AFormItem>
        <AFormItem>
          <AInput
            v-decorator="getRules('password')"
            v-focus="passwordFocus"
            type="password"
            size="large"
            placeholder="密码:"
          >
            <AIcon slot="prefix" type="lock" class="login-form-icon" />
          </AInput>
        </AFormItem>
        <AFormItem>
          <ACheckbox v-decorator="getRules('remember')">自动登录</ACheckbox>
          <a class="login-form-forgot" href="">忘记密码</a>
          <AButton :loading="loading" size="large" type="primary" html-type="submit" block>登录</AButton>
        </AFormItem>
      </AForm>
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import db, { StorageKeys } from '@/libs/db';
import { debounce } from '@/libs/utils';

export default {
  name: 'Login',
  directives: {
    focus(el, { value }) {
      if (value) {
        const find = Array.prototype.find;
        const targetNode = find.call(el.childNodes, node => node.localName === 'input');
        if (targetNode) {
          targetNode.focus();
        }
      }
    },
  },
  data() {
    return {
      title: this.$app.title.main,
      publicPath: process.env.BASE_URL,
      loading: false,
      // 密码输入框是否获取焦点
      passwordFocus: false,
    };
  },
  beforeCreate() {
    this.loginForm = this.$form.createForm(this);
  },
  created() {
    this.login = debounce(this.login, 360);
    this.setRules();
  },
  methods: {
    ...mapActions('user', ['handleLogin']),
    login() {
      this.loginForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.loading = true;
          this.clearDB();
          this.handleLogin(values)
            .then(() => {
              this.$router.push({ name: this.$app.mainName });
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
              this.$message.error(err.msg);
            });
        }
      });
    },
    setRules() {
      this.rulesForm = {
        username: {
          initialValue: 'admin',
          validateFirst: true,
          normalize: value => (value ? value.toString().trim() : null),
          rules: [
            { required: true, whitespace: true, message: '请输入你的用户名!' },
            { min: 4, message: '不少于4个字符' },
            { max: 30, message: '不超过30个字符' },
            { validator: this.validateToPassword },
          ],
        },
        password: {
          initialValue: 'admin-template',
          validateFirst: true,
          normalize: value => (value ? value.toString().trim() : null),
          rules: [
            { required: true, whitespace: true, message: '请输入你的密码!' },
            { min: 5, message: '不少于5个字符' },
            { max: 45, message: '不超过45个字符' },
            { validator: this.compareToUsername },
          ],
        },
        remember: {
          valuePropName: 'checked',
          initialValue: true,
        },
      };
    },
    getRules(key) {
      return [key, this.rulesForm[key]];
    },
    setPasswordFocus(bool) {
      this.passwordFocus = bool;
    },
    compareToUsername(rule, value, callback) {
      if (value === this.loginForm.getFieldValue('username')) {
        return callback(new Error('密码不能和用户名重复'));
      }
      callback();
    },
    validateToPassword(rule, value, callback) {
      if (value && this.loginForm.getFieldValue('password')) {
        this.loginForm.validateFields(['password'], { force: true });
      }
      callback();
    },
    clearDB(username) {
      if (!this.isClearDB && db.get(StorageKeys.USER_INFO, {}).username !== username) {
        db.clear();
        this.isClearDB = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  margin: 24vh 0 64px;
  @media screen {
    @media (max-width: 1600px) {
      margin: 18vh 0 56px;
    }
    @media (max-width: 576px) {
      margin: 18vh 0 36px;
    }
  }

  &-logo {
    margin-right: 16px;
  }

  &-title {
    display: inline-block;
    font-size: 38px;
    font-weight: 600;
    line-height: 46px;
    vertical-align: middle;
    @media screen and (max-width: 1600px) {
      font-size: 34px;
    }
  }
}

.login-form {
  width: 368px;
  margin: 0 auto;
  @media screen and (max-width: 576px) {
    width: 94%;
  }

  &-forgot {
    float: right;
  }

  &-icon {
    color: rgba(0, 0, 0, 0.36);
  }
}
</style>

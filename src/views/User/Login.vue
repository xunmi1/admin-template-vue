<template>
    <div>
        <header class="header v-center">
            <img
                v-once
                v-if="logo"
                :src="logo"
                alt="logo"
                height="46"
                class="header-logo"
            >
            <h1 class="header-title v-to-zero">{{ title }}</h1>
        </header>
        <main>
            <AForm :form="loginForm" @submit.stop.prevent="login" class="login-form">
                <AFormItem>
                    <AInput
                        v-decorator="getRules('userName')"
                        placeholder="用户名:"
                        size="large"
                        @pressEnter.stop.prevent="setPasswordFocus(true)"
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
                    <ACheckbox v-decorator="getRules('remember')">
                        自动登录
                    </ACheckbox>
                    <a class="login-form-forgot" href="">忘记密码</a>
                    <AButton
                        :loading="loading"
                        size="large"
                        type="primary"
                        html-type="submit"
                        block
                    >
                        登录
                    </AButton>
                </AFormItem>
            </AForm>
        </main>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'Login',
        directives: {
            focus (el, { value }) {
                if (value) {
                    const find = Array.prototype.find;
                    const targetNode = find.call(el.childNodes, node => node.localName === 'input');
                    if (targetNode) {
                        targetNode.focus();
                    }
                }
            }
        },
        data () {
            return {
                title: this.$app.title.main,
                loading: false,
                // 密码输入框是否获取焦点
                passwordFocus: false
            };
        },
        beforeCreate () {
            this.loginForm = this.$form.createForm(this);
            this.rulesForm = {
                userName: {
                    initialValue: 'xycc',
                    validateFirst: true,
                    normalize: value => value ? value.toString().trim() : null,
                    rules: [
                        { required: true, whitespace: true, message: '请输入你的用户名!' },
                        { min: 4, message: '不少于4个字符' },
                        { max: 30, message: '不超过30个字符' }
                    ]
                },
                password: {
                    initialValue: 'xycczz',
                    validateFirst: true,
                    normalize: value => value ? value.toString().trim() : null,
                    rules: [
                        { required: true, whitespace: true, message: '请输入你的密码!' },
                        { min: 6, message: '不少于5个字符' },
                        { max: 45, message: '不超过45个字符' }
                    ]
                },
                remember: {
                    valuePropName: 'checked',
                    initialValue: true
                }
            };
        },
        created () {
            this.login = this.$_throttle(this.login, 360, true);
            this.setLogo();
        },
        methods: {
            ...mapActions('user', ['handleLogin']),
            login () {
                this.loginForm.validateFields((err, values) => {
                    if (!err) {
                        this.loading = true;
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
            getRules (key) {
                return [key, this.rulesForm[key]];
            },
            setPasswordFocus (bool) {
                this.passwordFocus = bool;
            },
            setLogo() {
                try {
                    this.logo = require('@/assets/svg/fire.svg');
                } catch (e) {
                    this.logo = null;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .header {
        margin: 104px 0 64px;
        @media screen {
            @media (max-width: 1400px) {
                margin: 80px 0 48px;
            }
            @media (max-width: 520px) {
                margin: 48px 0 24px;
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
            @media screen and (max-width: 1400px) {
                font-size: 34px;
            }
        }
    }
    .login-form {
        width: 368px;
        margin: 0 auto;
        @media screen and (max-width: 520px) {
            width: 88%;
        }

        &-forgot {
            float: right;
        }

        &-icon {
            color: rgba(0, 0, 0, .36);
        }
    }
</style>

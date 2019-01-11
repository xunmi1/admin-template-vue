<template>
    <div>
        <AInput size="large" v-model.trim="userName" />
        <AInput size="large" v-model.trim="password" />
        <AButton @click.enter="login" type="primary">登录</AButton>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'Login',
        data () {
            return {
                userName: 'xycc',
                password: 'xycczz'
            };
        },
        methods: {
            ...mapActions('user', ['handleLogin']),
            login () {
                this.handleLogin({
                    userName: this.userName.toString(),
                    password: this.password.toString()
                }).then(() => {
                    this.$router.push({ name: this.$app.mainName });
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style scoped>

</style>

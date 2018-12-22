<template>
    <div>
        <input type="text" v-model="userName">
        <input type="text" v-model="password">
        <button @click="login">登录</button>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'Login',
        data () {
            return {
                userName: '',
                password: ''
            };
        },
        methods: {
            ...mapActions(['handleLogin', 'getUserInfo']),
            login () {
                this.handleLogin({
                    userName: this.userName.toString(),
                    password: this.password.toString()
                }).then(res => {
                    console.log(res);
                });
            }
        }
    };
</script>

<style scoped>

</style>

<template>
    <div>
        <input type="text" v-model="userName">
        <input type="text" v-model="password">
        <button @click="login">登录</button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'Login',
        data () {
            return {
                userName: 'xycc',
                password: 'xycczz'
            };
        },
        computed: {
            ...mapGetters('user',['status'])
        },
        watch: {
            status (newValue) {
                console.log(newValue);
            }
        },
        methods: {
            ...mapActions('user',['handleLogin']),
            login () {
                this.handleLogin({
                    userName: this.userName.toString(),
                    password: this.password.toString()
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style scoped>

</style>

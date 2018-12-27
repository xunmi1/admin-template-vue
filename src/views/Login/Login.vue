<template>
    <div>
        <AInput size="large" v-model="userName" />
        <AInput size="large" v-model="password" />
        <AButton @click="login" type="primary">登录</AButton>
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
                    this.$router.push({name: 'Home'})
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style scoped>

</style>

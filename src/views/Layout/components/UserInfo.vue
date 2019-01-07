<template>
    <div class="user v-icon-hover">
        <ADropdown>
            <div>
                <AAvatar :src="avatar" class="user-avatar">{{ avatar.slice(0, 3) }}</AAvatar>
                <span class="user-nickname">{{ nickName }}</span>
            </div>
            <AMenu slot="overlay" class="user-menu">
                <AMenuItem>
                    <AIcon type="user" />
                    个人设置
                </AMenuItem>
                <AMenuDivider />
                <AMenuItem @click="logout">
                    <AIcon type="logout" />
                    退出登录
                </AMenuItem>
            </AMenu>
        </ADropdown>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';

    export default {
        name: 'UserInfo',
        computed: {
            ...mapState('user', ['avatar', 'nickName'])
        },
        methods: {
            ...mapMutations('user', ['setToken']),
            logout () {
                this.setToken();
                this.$router.replace({ name: this.$app.loginName });
            }
        }
    };
</script>

<style lang="less" scoped>
    .user {
        display: inline-block;
        padding: 0 12px;

        &-avatar {
            width: 36px;
            height: 36px;
            line-height: 36px;
            background-color: #1890ff;
            vertical-align: middle;
            margin-right: 8px;
        }
        &-nickname {
            font-size: 14px;
        }
        &-menu {
            min-width: 140px;
        }
    }
</style>

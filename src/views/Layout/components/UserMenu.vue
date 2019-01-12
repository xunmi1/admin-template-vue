<template>
    <div class="user v-icon-hover">
        <ADropdown>
            <div>
                <AAvatar
                    :size="36"
                    :src="avatar"
                    :alt="nickName.slice(0, 5)"
                    class="user-avatar v-theme-bg"
                >
                    {{ nickName.slice(0, 5) }}
                </AAvatar>
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
        name: 'UserMenu',
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

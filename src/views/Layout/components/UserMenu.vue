<template>
    <div class="user v-icon-hover">
        <ADropdown>
            <div>
                <AAvatar
                    :size="36"
                    :src="avatar"
                    :alt="nickName.slice(0, 3)"
                    class="user-avatar v-theme-bg"
                >
                    {{ nickName.slice(0, 5) }}
                </AAvatar>
                <span class="user-nickname">{{ nickName }}</span>
            </div>
            <template #overlay>
                <AMenu class="user-menu">
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
            </template>
        </ADropdown>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'UserMenu',
        computed: {
            ...mapState('user', ['avatar', 'nickName'])
        },
        methods: {
            ...mapActions('user', ['handleLogout']),
            logout () {
                this.handleLogout()
                    .then(({ msg }) => {
                        this.$message.success(msg);
                        this.$router.replace({ name: this.$app.loginName });
                    })
                    .catch(({ msg }) => this.$message.error(msg));
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
            /deep/ .ant-avatar-string {
                line-height: 32px !important;
            }
        }

        &-nickname {
            font-size: 16px;
        }

        &-menu {
            min-width: 140px;
        }
    }
</style>

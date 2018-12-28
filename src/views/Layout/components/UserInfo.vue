<template>
    <div class="user pointer icon-hover">
        <ADropdown>
            <div>
                <AAvatar :src="avatar" class="user-avatar">{{ avatar.slice(0, 3) }}</AAvatar>
                <span class="user-nickname">{{ nickName }}</span>
            </div>
            <AMenu slot="overlay">
                <AMenuItem key="0"><AIcon type="setting" />个人设置</AMenuItem>
                <AMenuDivider />
                <AMenuItem key="1"><AIcon type="logout" />退出登录</AMenuItem>
            </AMenu>
        </ADropdown>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: 'UserInfo',
        computed: {
            ...mapState('user',['avatar', 'nickName'])
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
    }
</style>

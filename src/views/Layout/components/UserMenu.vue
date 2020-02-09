<template>
  <div class="user v-icon-hover">
    <ADropdown>
      <div>
        <AAvatar :alt="nickname" :size="36" :src="avatar" class="user-avatar v-theme-bg">
          {{ nickname.slice(0, 5) }}
        </AAvatar>
        <span class="user-nickname">{{ nickname }}</span>
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
import { mapActions, mapState } from 'vuex';

export default {
  name: 'UserMenu',
  computed: {
    ...mapState('user', ['avatar', 'nickname']),
  },
  methods: {
    ...mapActions('user', ['handleLogout']),
    logout() {
      this.handleLogout().then(() => this.$router.replace({ name: this.$app.loginName }));
    },
  },
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
    font-size: 14px;
  }

  &-menu {
    min-width: 140px;
  }
}
</style>

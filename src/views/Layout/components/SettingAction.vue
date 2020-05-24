<template>
  <ATooltip v-once title="界面设置">
    <div class="setting v-icon-hover" v-on="$listeners">
      <AIcon type="setting" class="icon" />
    </div>
  </ATooltip>
</template>

<script>
export default {
  name: 'SettingAction',
};
</script>

<style lang="less" scoped>
.setting {
  display: inline-block;
  padding: 0 12px;
  cursor: pointer;

  .icon {
    font-size: 16px;
    vertical-align: middle;
  }
}
</style>

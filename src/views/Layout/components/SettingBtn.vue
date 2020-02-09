<template functional>
  <ATooltip title="界面设置">
    <div class="setting v-icon-hover" v-on="listeners">
      <AIcon type="setting" class="setting-icon" />
    </div>
  </ATooltip>
</template>

<style lang="less" scoped>
.setting {
  display: inline-block;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;

  &-icon {
    font-size: 16px;
    vertical-align: -0.2rem;
  }
}
</style>

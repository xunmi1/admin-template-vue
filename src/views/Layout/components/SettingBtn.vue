<template>
    <ATooltip title="界面设置">
        <div class="setting v-icon-hover">
            <AIcon type="setting" class="setting-icon" />
        </div>
    </ATooltip>
</template>
<script>
    export default {
        name: 'SettingBtn'
    };
</script>
<style lang="less" scoped>

    .setting {
        display: inline-block;
        height: 100%;
        padding: 0 12px;
        cursor: pointer;

        &-icon {
            font-size: 16px;
            vertical-align: middle;
        }
    }
</style>

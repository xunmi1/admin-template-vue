<template functional>
    <ABackTop>
        <div class="back-top">
            <AIcon class="back-top-icon" type="up" />
        </div>
    </ABackTop>
</template>

<style lang="less" scoped>
    .back-top {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .5);
        text-align: center;
        transition: all .3s cubic-bezier(0.6, 0.05, 0.36, 1);

        &-icon {
            color: #fff;
            font-size: 16px;
            line-height: 40px;
        }
    }
</style>

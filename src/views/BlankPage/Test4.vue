<template>
    <div>
        <h3>组件懒加载</h3>
        <VLazyComponent>
            <template #default="{isLoad}">
                <VRichEditor v-if="isLoad" />
            </template>
            <template #skeleton>
                <ASkeleton :paragraph="{ rows: 12 }" />
            </template>
        </VLazyComponent>
    </div>
</template>

<script>
    export default {
        name: 'Test4',
    };
</script>

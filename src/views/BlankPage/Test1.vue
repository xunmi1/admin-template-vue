<template>
    <div>
        <VRichEditor v-model="content" type="word" />
    </div>
</template>

<script>
    export default {
        name: 'Test1',
        data() {
            return {
                content: '12345',
            };
        },
        created() {
            setTimeout(() => {
                this.content = '54321';
            }, 2000);
        }
    };
</script>

<style scoped>

</style>

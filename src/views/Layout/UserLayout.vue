<template>
    <ALayout class="container">
        <ALayoutContent>
            <RouterView />
        </ALayoutContent>
        <Footer />
    </ALayout>
</template>

<script>
    import Footer from './components/Footer';
    import themeMixin from './mixins/themeMixin';

    export default {
        name: 'UserLayout',
        components: {
            Footer
        },
        mixins: [themeMixin]
    };
</script>

<style scoped>
    .container {
        min-height: 100vh;
        background-image: url(../../assets/svg/backgroundImage.svg);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
    }
    .container >>> .ant-layout-footer {
        background: transparent;
    }
</style>

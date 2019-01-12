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

    export default {
        name: 'UserLayout',
        components: {
            Footer
        }
    };
</script>

<style scoped>
    .container {
        min-height: 100vh;
    }
</style>

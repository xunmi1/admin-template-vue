const articles = {
    path: 'articles',
    isMock: true,
    method: 'get',
    handler() {
        return {
            data: []
        };
    }
};
export default [
    articles
];

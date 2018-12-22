const userDB = [
    { username: 'admin', password: 'admin', uid: '1', name: '管理员' },
    { username: 'editor', password: 'editor', uid: '2', name: '编辑' },
    { username: '1', password: '1', uid: '3', name: '用户' },
];

export default [
    {
        path: '/api/login',
        method: 'post',
        handler ({ body }) {
            console.log(arguments);
            const user = userDB.find(item => item.username === body.userName && item.password === body.password);
            if (user) {
                return {
                    status: 1,
                    info: {
                        ...user,
                        token: '8dfhassad0asdjwoeiruty'
                    }
                }
            } else {
                return {
                    status: 0
                }
            }
        }
    }
]

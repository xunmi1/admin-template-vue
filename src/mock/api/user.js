const userDB = [
    { username: 'admin', password: 'admin', uid: '1', name: '管理员' },
    { username: 'editor', password: 'editor', uid: '2', name: '编辑' },
    { username: '1', password: '1', uid: '3', name: '用户' },
];

export default [
    {
        path: '/test/login',
        method: 'post',
        handler ({ body }) {
            const user = userDB.find(item => item.username === body.userName && item.password === body.password);
            if (user) {
                return {
                    code: 200,
                    msg: '成功',
                    data: {
                        ...user,
                        token: '8dfhassad0asdjwoeiruty'
                    }
                }
            } else {
                return {
                    code: 422,
                    msg: '失败',
                    errors: {

                    }
                }
            }
        }
    }
]

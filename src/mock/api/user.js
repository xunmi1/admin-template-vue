const userDB = [
    { username: 'admin', password: 'admin', uid: '1', name: '管理员' },
    { username: 'editor', password: 'editor', uid: '2', name: '编辑' },
    { username: 'xycc', password: 'xycczz', nickname: '1234', avatar: '11',email: '' },
];

export default [
    {
        path: 'login',
        // isMock: true,
        method: 'post',
        handler ({ body }) {
            const user = userDB.find(item => item.username === body.username && item.password === body.password);
            if (user) {
                return {
                    info:user,
                    access_token: '8dfhassad0asdjwoeiruty'
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

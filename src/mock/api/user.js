const userDB = [
    { username: 'admin', password: 'ant-system', nickname:'admin', id: '1' },
    { username: 'editor', password: 'editor', uid: '2', name: '编辑' },
    { username: 'xycc', password: 'xycczz', nickname: '1234', id: 1, avatar: '11',email: '' },
];

const login = {
    path: 'login',
    isMock: true,
    method: 'post',
    handler ({ body }) {
        const user = userDB.find(item => item.username === body.username && item.password === body.password);
        if (user) {
            return {
                info:user,
                access_token: '8dfhassad0asdjwoeiruty'
            };
        } else {
            return {
                code: 422,
                msg: '失败',
                errors: {}
            };
        }
    }
};

const getPermissions = {
    path: 'getPermissions',
    isMock: true,
    method: 'get',
    handler(req) {
        if (req.params.usetId) {
            return {
                data: {
                    Test11: true,
                    Test12: false,
                }
            };
        }
    }
};
const uploadImg = {
    path: 'uploadImg',
    isMock: true,
    method: 'post',
    handler(req) {
        return {
            data: req.body.get('image')
        };
    }
};
export default [
    login,
    getPermissions,
    uploadImg
];

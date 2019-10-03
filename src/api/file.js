/**
 * 文件上传
 */
import service from '@/libs/service';

export function upload ({ name = 'image', file, onProgress }) {
    if (!['image', 'file'].includes(name)) {
        return Promise.reject({ msg: '类型错误！' });
    }
    const formData = new FormData();
    formData.append('file', file);
    return service.request({
        notVersion: true,
        url: `/admin/upload/${name}s`,
        headers: { 'Content-Type': 'multipart/form-data' },
        method: 'post',
        data: formData,
        onUploadProgress ({ total, loaded }) {
            if (typeof onProgress === 'function') {
                onProgress({ percent: Math.round(loaded / total * 100) }, file);
            }
        },
    });
}

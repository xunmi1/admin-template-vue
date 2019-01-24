/**
 * 文件上传
 */
import service from '@/libs/service';

export function uploadImg (formData) {
    return service.request({
        url: 'uploadImg',
        headers: {'Content-Type': 'multipart/form-data'},
        method: 'post',
        data: formData
    });
}

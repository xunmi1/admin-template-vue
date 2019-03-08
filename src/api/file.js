/**
 * 文件上传
 */
import service from '@/libs/service';

export function uploadImg ({name = 'image', file, onProgress}) {
    const formData = new FormData();
    formData.append(name, file);
    return service.request({
        notVersion: true,
        url: 'uploadImg',
        headers: {'Content-Type': 'multipart/form-data'},
        method: 'post',
        data: formData,
        onUploadProgress({ total, loaded })  {
            if (typeof onProgress === 'function') {
                onProgress({ percent: Math.round(loaded / total * 100).toFixed(2) }, file);
            }
        },
    });
}

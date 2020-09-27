/**
 * 文件上传
 */
import http from '@/libs/http';

export function upload({ name = 'image', headers, file, data, cancelToken, onUploadProgress, withCredentials }) {
  if (!['image', 'file', 'video', 'audio'].includes(name)) {
    return Promise.reject({ msg: '类型错误!' });
  }

  return http.post(`upload/${name}`, {
    headers: headers ?? { 'Content-Type': 'multipart/form-data' },
    data: getFormData(file, data),
    withCredentials,
    cancelToken,
    onUploadProgress,
  });
}

const getFormData = (file, data) => {
  const formData = new FormData();
  if (data) Object.keys(data).map(key => formData.append(key, data[key]));
  formData.append('file', file);
  return formData;
};

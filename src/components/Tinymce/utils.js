// 检索字符串中是否满足子字符串
export function search(str, target) {
  return str.toLowerCase().search(target) !== -1;
}

// 从 `media` 区分视频、音频
export function distinguishMedia(type) {
  if (search(type, 'video/*')) return 'video';
  if (search(type, 'audio/*')) return 'audio';
}

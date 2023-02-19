import { v4 as uuidv4 } from 'uuid'
export const getUUID = () => {
  // 先从本地存储获取UUID（看一下本地存储里面是否含有）
  let uuid_token = localStorage.getItem('UUODTOKEN');
  // 如果没有，就自己生成一个，并在本地存储一次
  if (!uuid_token) {
    uuid_token = uuidv4();
    localStorage.setItem('UUIDTOKEN', uuid_token)
  }
  return uuid_token
}
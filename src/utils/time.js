/** 获取当前时间 YYYY-MM-DD HH:mm:ss */
export const getLocaleTime = (date) => {
  const now = date || new Date();
  return now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
};

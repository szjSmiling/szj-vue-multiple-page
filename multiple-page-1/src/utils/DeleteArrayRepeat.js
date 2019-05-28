export const DeleteArrayRepeat = (arr, repeatKey) => {
  let obj = {};
  arr = arr.reduce((item, next) => {
    if (!obj[next[repeatKey]]) obj[next[repeatKey]] = true && item.push(next)
    return item;
  }, []);
  return arr;
}

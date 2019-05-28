const offsetLeft = (element) => {
  let el = element;
  let x = el.offsetLeft;
  while (el.offsetParent) {
    x += el.offsetParent.offsetLeft;
    el = el.offsetParent;
  }
  return x;
}
const addBodyOverHidden = () => {
  document.body.style.overflow = 'hidden'
}
const removeBodyOverHidden = () => {
  document.body.style.overflow = 'auto';
}

export { offsetLeft, addBodyOverHidden, removeBodyOverHidden };

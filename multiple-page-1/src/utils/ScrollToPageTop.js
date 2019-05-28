export const ScrollToPageTop = (who) => {
  var top = document.getElementsByClassName(who)[0].offsetTop;
  let timerScroll = requestAnimationFrame(function fn () {
    let oTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (oTop > 0 && top > 0) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      timerScroll = requestAnimationFrame(fn);
    } else {
      cancelAnimationFrame(timerScroll);
    }
  })
};

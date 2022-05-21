export const isMobile = {
  android: navigator.userAgent.match(/Android/i),
  blackBerry: navigator.userAgent.match(/BlackBerry/i),
  ipad: navigator.userAgent.match(/iPad/i),
  iOS: navigator.userAgent.match(/iPhone|iPad|iPod/i),
  opera: navigator.userAgent.match(/Opera Mini/i),
  windows: navigator.userAgent.match(/Windows Phone/i),
  amazonePhone: navigator.userAgent.match(
    /(?:SD4930UR|\\bSilk(?:.+)Mobile\\b)/i
  ),
  amazoneTablet: navigator.userAgent.match(/Silk/i),
  any: navigator.userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|Windows Phone|(?:SD4930UR|\bSilk(?:.+)Mobile\b)|Silk/i
  ),
}

function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function randomCode() {
  const length = 6 + Math.floor(Math.random() * 3); // 6..8
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

module.exports = { isValidCode, isValidUrl, randomCode };

var fun_aes = require('aes.js')

 function encrypt(word) {
  var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
   var key = fun_aes.CryptoJS.enc.Utf8.parse("yhxx123yhxx456sc");
  var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, {
    mode: fun_aes.CryptoJS.mode.ECB,
    padding: fun_aes.CryptoJS.pad.Pkcs7
  });
  //返回大写十六进制加密结果
  return encrypted.toString();
}


function decrypt(word) {
  var key = fun_aes.CryptoJS.enc.Utf8.parse("yhxx123yhxx456sc");
  //mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7
  var decrypt = fun_aes.CryptoJS.AES.decrypt(word, key, {
    mode: fun_aes.CryptoJS.mode.ECB,
    padding: fun_aes.CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(fun_aes.CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}



module.exports = {
  encrypt: encrypt,
  decrypt: decrypt

}

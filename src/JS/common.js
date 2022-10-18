import { removeCookie } from 'js/cookie';
import { errorList } from 'js/array';

export const byteCount = (text, setText, setByte, column, maxByte) => {
  let countByte;
  let byte = 0;
  let returnLength = 0;

  for (let i = 0; i < text.length; i++) {
    countByte = text.charAt(i);
    if (escape(countByte).length > 4) byte += 2;
    else byte++;
    if (byte <= maxByte) returnLength = i + 1;
  }
  if (byte > maxByte) {
    alert(`최대 ${maxByte}Bytes까지만 입력 가능합니다.`);
    const cutStr = text.substring(0, returnLength);
    setText(prev => {
      const clone = { ...prev };
      clone[column] = cutStr;
      return clone;
    });
  } else {
    if (column === 'answer') {
      return setByte(byte);
    } else if (column === 'context' || column === 'title') {
      return setByte(prev => {
        const clone = { ...prev };
        clone[column] = byte;
        return clone;
      });
    }
  }
};

export const catchError = (result, navigate) => {
  if (
    result === 'duplicateLogin' ||
    result === 'tokenError' ||
    result === 'tokenExpired'
  ) {
    alert(errorList[result]);
    removeCookie('myToken');
    removeCookie('rfToken');
    navigate('/');
    return;
  } else if (result === 'renderErrorPage') navigate('/error');
  else alert(errorList[result]);
};

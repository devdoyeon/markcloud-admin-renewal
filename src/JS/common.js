import { removeCookie } from 'JS/cookie';
import { errorList } from 'JS/array';

export const catchError = async (result, navigate, setModal) => {
  if (
    result === 'duplicateLogin' ||
    result === 'tokenError' ||
    result === 'tokenExpired' ||
    result === 'accessDenied'
  ) {
    removeCookie('myToken');
    removeCookie('rfToken');
    navigate('/');
    return alert(errorList[result]);
  } else if (result === 'renderErrorPage') navigate('/error');
  else if (result === 'notFound') navigate('/not-found');
  else if (result === 'AccessTokenExpired') return;
  else commonModalSetting(setModal, true, '', 'alert', errorList[result]);
};

export const changeState = (setState, column, value) => {
  setState(prev => {
    const clone = { ...prev };
    clone[column] = value;
    return clone;
  });
};

export const enterFn = (e, okFn) => {
  if (e.key === 'Enter') okFn();
  else return;
};

export const commonModalSetting = (
  setAlertBox,
  bool,
  mode,
  context
) => {
  if (bool) {
    setAlertBox({
      mode: mode,
      context: context,
      bool: bool,
    });
  } else {
    setAlertBox({
      mode: '',
      context: '',
      bool: bool,
    });
  }
};

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
    const cutStr = text.substring(0, returnLength);
    changeState(setText, column, cutStr);
  } else {
    if (column === 'answer') {
      return setByte(byte);
    } else if (column === 'context' || column === 'title') {
      return changeState(setByte, column, byte);
    }
  }
};
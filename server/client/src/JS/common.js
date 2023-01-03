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
  else commonModalSetting(setModal, true, 'alert', errorList[result]);
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

export const commonModalSetting = (setAlertBox, bool, mode, context) => {
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

export const outClick = (e, setModal) => {
  if (e.target.className === 'modal-background') {
    setModal(false);
    window.removeEventListener('click', outClick);
  }
};

export const maskingInfo = (type, str) => {
  if (type === 'email')
    return `${str.split('@')[0].slice(0, 2)}${'*'.repeat(
      str.split('@')[0].length - 2
    )}@${str.split('@')[1]}`;
  else if (type === 'phone')
    return `${str.split('-')[0]}-****-${str.split('-')[2]}`;
  else if (type === 'name') {
    if (str.length === 2) return `${str.slice(0, 1)}*`;
    else if (str.length === 3) return `${str.slice(0, 1)}*${str.slice(2)}`;
    else if (str.length >= 4) return `${str.slice(0, 1)}**${str.slice(3)}`;
  } else if (type === 'id') {
    if (str.length <= 6)
      return `${str.slice(0, 2)}${'*'.repeat(str.length - 2)}`;
    else return `${str.slice(0, 4)}${'*'.repeat(str.length - 4)}`;
  }
};

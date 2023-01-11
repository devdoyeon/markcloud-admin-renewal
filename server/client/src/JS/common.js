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
      if (str.length < 3) return str;
      else return `${str.slice(0, 2)}${'*'.repeat(Number(str.length) - 2)}`;
    else return `${str.slice(0, 4)}${'*'.repeat(Number(str.length) - 4)}`;
  }
};

export const regularExpression = (type, str) => {
  let regExp;
  switch (type) {
    case 'id':
      regExp = /^[a-z0-9]{4,30}$/;
      break;
    case 'pw':
      regExp =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/;
      break;
    case 'email':
      regExp =
        /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(kr|aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
      break;
    default:
      break;
  }
  return regExp.test(str.trim());
};

export const addHyphen = phone => {
  return phone
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
};

export const addZero = t => {
  if (t < 10) return `0${t}`;
  else return t;
};
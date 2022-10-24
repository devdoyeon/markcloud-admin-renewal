import { removeCookie } from 'JS/cookie';
import { errorList } from 'JS/array';

export const changeState = (setState, column, value) => {
  setState(prev => {
    const clone = { ...prev };
    clone[column] = value;
    return clone;
  });
};

export const commonModalSetting = async (
  setModal,
  bool,
  answer,
  mode,
  context
) => {
  if (bool) {
    await setModal({
      mode: mode,
      context: context,
      bool: bool,
      answer: '',
    });
    return answer;
  } else {
    await setModal({
      mode: '',
      context: '',
      bool: bool,
    });
    return answer;
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
    alert(`최대 ${maxByte}Bytes까지만 입력 가능합니다.`);
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

export const catchError = async (result, navigate, setModal) => {
  if (
    result === 'duplicateLogin' ||
    result === 'tokenError' ||
    result === 'tokenExpired'
  ) {
    await commonModalSetting(setModal, true, '', 'alert', errorList[result]);
    removeCookie('myToken');
    removeCookie('rfToken');
    navigate('/');
    return;
  } else if (result === 'renderErrorPage') navigate('/error');
  else commonModalSetting(setModal, true, '', 'alert', errorList[result]);
};

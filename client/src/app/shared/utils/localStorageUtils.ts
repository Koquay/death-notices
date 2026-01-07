export const persistStateToLocalStorage = (state: any) => {
  let deathNoticeStr = localStorage.getItem('deathNotice');

  let deathNoticeObj;

  if (deathNoticeStr) {
    deathNoticeObj = JSON.parse(deathNoticeStr);
  } else {
    deathNoticeObj = {};
  }

  deathNoticeObj = { ...deathNoticeObj, ...state };
  localStorage.setItem('deathNotice', JSON.stringify(deathNoticeObj));

  deathNoticeStr = localStorage.getItem('deathNotice');
  console.log('deathNoticeStr after persistStateToLocalStorage.deathNoticeStr', deathNoticeStr)

};





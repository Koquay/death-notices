
export const persistStateToLocalStorage = (state: any) => {
  const stored = localStorage.getItem('deathNotice');
  const existing = stored ? JSON.parse(stored) : {};

  const cleanedState = Object.fromEntries(
    Object.entries(state).filter(([_, value]) => value !== undefined)
  );

  const merged = { ...existing, ...cleanedState };

  localStorage.setItem('deathNotice', JSON.stringify(merged));
};








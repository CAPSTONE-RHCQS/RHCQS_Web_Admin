export const isAnyInitialInfoFinalized = (
  initialInfo: { Status: string }[] | undefined,
): boolean => {
  return initialInfo
    ? initialInfo.some((info) => info.Status === 'Finalized')
    : false;
};

export const isAnyFinalInfoFinalized = (
  finalInfo: { Status: string | null }[] | undefined,
): boolean => {
  return finalInfo
    ? finalInfo.some((info) => info.Status === 'Finalized')
    : false;
};

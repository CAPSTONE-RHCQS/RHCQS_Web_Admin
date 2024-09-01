export const formatCurrencyShort = (value: number): string => {
  const billion = Math.floor(value / 1e9);
  const million = Math.floor((value % 1e9) / 1e6);
  const thousand = Math.floor((value % 1e6) / 1e3);
  const remainder = value % 1e3;

  let result = '';
  if (billion > 0) result += `${billion} tỷ `;
  if (million > 0) result += `${million} triệu `;
  if (thousand > 0) result += `${thousand} nghìn `;
  if (remainder > 0) result += `${remainder} đồng`;

  return result.trim();
};

export const formatVietnamesePhoneNumber = (
  phone: string | undefined,
): string => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{5})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  return phone;
};

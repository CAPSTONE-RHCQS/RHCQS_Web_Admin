export const truncateName = (name: string, maxLength: number): string => {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
};


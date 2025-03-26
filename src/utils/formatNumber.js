export const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num);
  };
  
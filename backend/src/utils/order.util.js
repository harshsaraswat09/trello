export const ORDER_STEP = 1000;

export const getOrderBetween = (previousOrder, nextOrder) => {
  if (previousOrder == null && nextOrder == null) return ORDER_STEP;
  if (previousOrder == null) return nextOrder - ORDER_STEP;
  if (nextOrder == null) return previousOrder + ORDER_STEP;
  return (previousOrder + nextOrder) / 2;
};

export const formatQuantity = (quantity: string | number | undefined) => {
  if (String(quantity).includes('00')) {
    return Number(Number(quantity).toFixed(5)) || 0
  }

  return Number(Number(quantity).toFixed(2)) || 0
}

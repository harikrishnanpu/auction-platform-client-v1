export function formatInr(amountRupees: number): string {
  console.log('amountRupees', amountRupees);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amountRupees);
}

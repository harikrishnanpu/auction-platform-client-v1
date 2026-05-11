export function getMockAssistantReply(userText: string): string {
  const t = userText.toLowerCase().trim();

  if (t.includes('bid') || t.includes('bidding')) {
    return 'Open an auction you like and enter your bid before the timer ends. If someone outbids you, you can raise your bid if the phase is still active. Need help with a specific listing?';
  }
  if (t.includes('payment') || t.includes('pay') || t.includes('wallet')) {
    return 'Wallet top-ups and payments go through our secure checkout. You can review transaction history under Profile → Wallet or Payments.';
  }
  if (t.includes('auction') || t.includes('hammer')) {
    return 'Browse live and upcoming auctions from Home. Each listing shows current bid, time left, and item details. Tap in to join the room when bidding is open.';
  }
  if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
    return 'Hello! I am here to help you get comfortable with HammerDown. Try asking about bidding, your wallet, or finding auctions.';
  }

  return 'Thanks for your message. I can help with auctions, bidding, wallet, and navigating your profile. What would you like to know next?';
}

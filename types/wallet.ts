export interface Wallet {
  id: string;
  name: string;
  emoji: string;
  currency: string;
}

export const WALLET_EMOJIS = ['💳', '🏦', '💰', '🪙', '💵', '🐷', '🎯', '⭐'];

export const DEFAULT_WALLET: Omit<Wallet, 'id'> = {
  name: 'Main Wallet',
  emoji: '💳',
  currency: 'USD',
};

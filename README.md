# Zeus Wallet: Solana + Bitcoin Payment App

This is a cross-chain mobile wallet built with Expo/React Native, supporting both Solana and Bitcoin payments. It allows users to send and receive payments, scan QR codes to pay, and manage their balances securely.

## Features
- Solana and Bitcoin wallet support
- Send and receive payments
- Scan QR codes to pay (Solana Pay and Bitcoin BIP21)
- Secure key management (Solana via Mobile Wallet Adapter, Bitcoin via in-memory/demo storage)
- Transaction history and payment requests

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the app
   ```bash
   npx expo start
   ```

## Project Structure
- `app/wallet/` — Wallet providers and hooks for Solana and Bitcoin
- `screens/` — Main screens (Home, Send, Receive, QR Scanner, Payment)
- `components/` — UI components (Balance, TransactionList, SendForm, etc.)
- `utils/` — Utility functions (QR parsing, formatting, etc.)

## Learn More
- [Solana Pay](https://github.com/solana-labs/solana-pay)
- [Bitcoin BIP21](https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki)

---

This project is a work in progress. Contributions welcome!
# zeus-wallet

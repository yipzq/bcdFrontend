# Blockchain RMT Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 📦 Installation

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

Install all required dependencies:

```bash
npm install
```

Install additional packages:

```bash
# Stripe integration
npm install --save stripe @stripe/react-stripe-js @stripe/stripe-js

# Database & Authentication
npm install mysql2
npm install jsonwebtoken
npm install bcrypt

# Blockchain
npm install ethers@latest
```

---

## 🧰 Tools to be downloaded

- [WAMP Server](https://sourceforge.net/projects/wampserver/)
- [VC++ Redistributables](https://github.com/abbodi1406/vcredist/releases)

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and add:

```env
# Stripe keys (replace with your own)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Smart contract config
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=your_contract_address (npm run deploy)
OWNER_PRIVATE_KEY=your_owner_private_key
RPC_URL=http://127.0.0.1:8545
CONTRACT_OWNER_ADDRESS="contract owner address" (npx hardhat node and get the its private key)

# PayPal keys
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret

# Database connection
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=bcd

# App environment and JWT secret (replace any jwt secret key you preferred)
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# Stripe webhook secret (Guided below Stripe Webhook Integration)
STRIPE_WEBHOOK_SECRET=your_webhook_signing_secret 
```

### How to get Smart Contract values:

1. Start local Hardhat blockchain:
   
   ```bash
   npx hardhat node
   ```
   
   - Copy the first address and its private key.

2. Deploy the contract:
   
   ```bash
   npm run deploy
   ```
   
   - Copy the deployed contract address.

> ⚠️ The example Stripe keys are for testing only.  
> 👉 [Create your own Stripe account](https://dashboard.stripe.com/register) to use your own keys.

---

## 🚀 Getting Started

Once dependencies are installed and `.env.local` is set up:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Admin Setup

1. Start WAMP server and go to phpMyAdmin.
2. Import `bcd.sql`.
3. Create an admin user via terminal:
   
   ```bash
   npm run create-admin
   ```

> Passwords are securely hashed. Remember the password you input for login.

---

## 💳 Stripe Webhook Integration

1. [Download Stripe CLI](https://stripe.com/docs/stripe-cli), unzip and run command prompt or open terminal in that folder.
2. Run:
   
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
3. Paste the webhook secret into `STRIPE_WEBHOOK_SECRET=your_webhook_signing_secret` in `.env.local`. 

🎥 [YouTube Setup Guide](https://www.youtube.com/watch?v=1l4NMj-NTUE&t=616s)

> You must keep this terminal running to update balances.

---

## PayPal Payouts

1. [Apply](https://www.paypal.com/my/webapps/mpp/account-selection) for a PayPal Business Account

2. Go to developer dashboard

3. Create platform-type REST API app and ensure Payouts is enabled

4. Copy and paste Client ID and Secret Key into 
   
   `PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-client-secret` in `.env.local`

---

## 📎 Included Files

- `bcd.sql` – Database schema and sample data (Please import in WAMP)

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Stripe API](https://stripe.com/docs)
- [Hardhat Docs](https://hardhat.org/docs)
- [WAMP](https://www.wampserver.com/en/)

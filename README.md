# Token sender (TypeScript / ethers.js)

Requirements

- Node.js (22+ recommended)
- The project dependencies (run `npm install`)
- An RPC node (Hardhat local node, Infura, Alchemy, etc.)

Install

```bash
npm install
```

Usage

Environment variables (.env):

- `RPC_URL` — RPC URL (e.g. http://127.0.0.1:8545)

CLI (example):

```bash
node src/send.ts --private-key <key> --to <address> --amount <amount>
```

Options

- `--private-key, -k` — private key (required)
- `--to, -t` — recipient address (required)
- `--amount, -a` — human-readable token amount (required)

Hardhat (local testing)

1. Start a local node (in another terminal):

    ```bash
    npx hardhat node
    ```

2. Check .env file

    ```text
    RPC_URL=http://127.0.0.1:8545
    ```

3. Get Private Key and Token diferent accounts from Hardhat log and run script in another terminal.

# Splitwise - Smart Contract

Splitwise is a decentralized smart contract that helps users keep track of shared expenses. It allows users to add IOUs (debts) between accounts and automatically resolves debt loops.

## Features

- Add debts between accounts
- Prevent users from owing themselves
- Resolve circular debts automatically
- Look up debt amounts between users

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Hardhat](https://hardhat.org/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/splitwise-contract.git
   cd splitwise-contract
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Compile the Smart Contract

Before deploying, compile the smart contract to check for errors:

```bash
npx hardhat compile
```

## Run a Local Ethereum Node

Start a local Hardhat network:

```bash
npx hardhat node
```

This will launch a blockchain simulation on `http://127.0.0.1:8545/`.

## Deploy the Smart Contract

Deploy the contract to the local Hardhat network:

```bash
npx hardhat run --network localhost scripts/deploy.js
```

## Running Tests

To test the contract, run:

```bash
npx hardhat test
```

This will execute the test cases defined in `test/test.js`.

## Run front-end to for visually communicate with smart contract

```bash
open web_app/index.html
```

## Troubleshooting

- If you encounter `HH108: Cannot connect to the network localhost`, ensure that `npx hardhat node` is running.
- If tests fail with `Invalid Chai property: revertedWith`, install `chai-as-promised` and `@nomicfoundation/hardhat-chai-matchers`:
  ```bash
  npm install --save-dev chai-as-promised @nomicfoundation/hardhat-chai-matchers
  ```

## License

This project is licensed under the MIT License.

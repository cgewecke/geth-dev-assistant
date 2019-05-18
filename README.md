# geth-dev-assistant

Quickly configure and launch a geth `--dev` ephemeral POA network.
Helpful when using geth in CI.

![Screen Shot 2019-05-18 at 12 06 40 AM](https://user-images.githubusercontent.com/7332026/57965995-0fe36600-7901-11e9-94eb-83a49b171bcb.png)

+ (Optionally) pulls and launches a docker geth instance as a background process ([default config]())
+ Waits a few seconds while the client spins up
+ Creates and unlocks some password generated accounts
+ Funds them with a balance
+ Mines blocks with no-op txs until a gas limit target is reached.

Geth `--dev` seeds with a single funded account and has a relatively low default block gas limit
(~ 6 mil). If the client's mining period is set to 0, it needs to be spun with transactions
before a higher gas limit target is reached.

### Install
```shell
npm install --save-dev geth-dev-assistant
```

### Run
```shell
npx geth-dev-assistant [options]
```

### Usage Example
```shell
npx geth-dev-assistant \
    --launch \
    --tag 'latest' \
    --accounts 5 \
    --balance 50 \
    --gasLimit 7000000

# Run tests
npx mocha

# Clean-up
docker stop geth-client
```

### Geth client requirements

+ `personal,web3,eth` APIs enabled
+ `--allow-insecure-unlock` flag set

### Options

| Option   | Description                                 | Type   | Default                |
| -------- | ------------------------------------------- | ------ | ---------------------- |
| accounts | number of accounts to create / unlock       | number | 10                     |
| password | for geth accounts                           | string | "left-hand-of-darkness"|
| balance  | account starting balances (in ETH)          | number | 100                    |
| gasLimit | block gas limit target to mine towards      | number | 5900000                |
| launch   | pull and launch a geth docker instance      | bool   | false                  |
| repo     | root docker repo (useful for forks)         | string | 'ethereum/client-go'   |
| tag      | geth version / docker tag to fetch          | string | 'stable'               |
| offline  | do not pull image from docker hub           | bool   | false                  |
| sleep    | ms to wait for geth to spin up              | number | 5000                   |
| port     | port to connect to client with              | number | 8545                   |
| protocol | "http", "ws", "ipc"                         | string | "http"                 |
| help     | show help                                   | bool   | false                  |


### Other resources
+ A POA network setup using genesis.json [at 0xProject](https://github.com/0xProject/0x-monorepo/blob/development/packages/devnet/genesis.json).
+ [ethnode](https://github.com/vrde/ethnode) a zero config tool to run a local Ethereum dev node (geth & parity!)
+ Geth client options [wiki](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options)

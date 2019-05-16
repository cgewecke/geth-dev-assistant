# geth-dev-assistant

A configuration utility for geth's `--dev` ephemeral POA network.
Helpful if you're running unit tests with geth in CI.

Geth `--dev` seeds with a single funded account and has a relatively low default block gas limit
(~ 6 mil). If the client's mining period is set to 0, it needs to be spun with transactions
before a higher gas limit target is reached.

This tool:

+ Waits a few seconds while geth launches
+ Creates and unlocks some password generated accounts
+ Funds them with a balance
+ Mines blocks with no-op txs until a gas limit target is reached.

### Install
```
npm install --save-dev geth-dev-assistant
```

### Client requirements

+ `personal,web3,eth` APIs enabled
+ `--allow-insecure-unlock` flag set

### Options

```shell
Usage: geth-dev-assistant [options]

Options:
  --accounts  number of accounts to create / unlock       [number] [default: 10]
  --password  for geth accounts      [string] [default: "left-hand-of-darkness"]
  --balance   account starting balances (in ETH)         [number] [default: 100]
  --gasLimit  block gas limit target to mine towards                    [number]
  --sleep     ms to wait for geth to spin up            [number] [default: 5000]
  --port      port to connect to client with            [number] [default: 8545]
  --protocol           [string] [choices: "http", "ws", "ipc"] [default: "http"]
  --help      Show help                                                [boolean]
```

### Usage Example
```shell
# Get client
docker pull ethereum/client-go:latest

# Launch client (silently)
docker run \
    -d \
    -p 8545:8545 \
    -p 30303:30303 \
    --name geth-client \
    --rm \
    ethereum/client-go:latest \
    --rpc \
    --rpcaddr '0.0.0.0' \
    --rpcport 8545 \
    --rpccorsdomain '*' \
    --rpcapi personal,web3,eth,net \
    --nodiscover \
    --allow-insecure-unlock \
    --dev \
    --dev.period 0 \
    --targetgaslimit '7000000' \
    > /dev/null &


# Configure client
npx geth-dev-assistant \
    --accounts 5 \
    --password 'hello' \
    --balance 50 \
    --gasLimit 7000000

# Run tests
npx mocha

# Clean-up
docker stop geth-client
```

### Other resources
+ A nice Clique POA network setup using genesis.json [at 0xProject](https://github.com/0xProject/0x-monorepo/blob/development/packages/devnet/genesis.json).
+ Geth client options [wiki](https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options)

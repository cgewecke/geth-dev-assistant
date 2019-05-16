set -o errexit

# Get client
docker pull ethereum/client-go:latest

# Launch client
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


# Post-launch setup
node ./index.js \
    --accounts 5 \
    --password 'hello' \
    --balance 50 \
    --gasLimit 7000000

# Run tests
npx mocha --timeout 5000

# Clean-up
docker stop geth-client

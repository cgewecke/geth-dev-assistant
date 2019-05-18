set -o errexit

# Post-launch setup
node ./index.js \
    --launch \
    --tag 'latest' \
    --accounts 5 \
    --password 'hello' \
    --balance 50 \
    --gasLimit 7000000

# Run tests
npx mocha --timeout 5000

# Clean-up
docker stop geth-client

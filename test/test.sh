set -o errexit

trap cleanup EXIT

cleanup(){
  echo "Shutting down docker client..."
  docker stop geth-client
}

# Block comment cheat-sheet
# : <<'END'
# END

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Instamining tests  (basic)"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>"

node ./index.js --tag 'latest'
npx mocha --grep "basic" --timeout 5000
cleanup

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Instamining tests (accounts)"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>"

node ./index.js \
    --launch \
    --tag 'latest' \
    --accounts 5 \
    --password 'hello' \
    --balance 50 \
    --gasLimit 7000000 \

# Run tests
npx mocha --grep "accounts" --timeout 5000
cleanup

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "Automining tests (--period)"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>"

node ./index.js --tag 'latest' --period 1
npx mocha --grep "period" --timeout 5000


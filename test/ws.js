const assert = require('assert');
const Web3 = require('web3');

describe('Insta-mining [ @basic-websockets ]', function(){
  let web3;

  before(()=> {
    web3 = new Web3('ws://127.0.0.1:8546');
  });

  it('has a single account', async function(){
    const accounts = await web3.eth.getAccounts();
    assert(accounts.length === 1, `Should have one account, actually has: ${accounts.length}`)
  });

  it('account is unlocked and can transact', async function(){
    const receiver = "0x458B8Adf2248709cf739149fE4BAb0B20101c4A1";
    const accounts = await web3.eth.getAccounts();
    const weiValueToSend = web3.utils.toWei('1', 'ether');

    let expectedWeiBalance = web3.utils.toWei('49', 'ether');
    expectedWeiBalance = web3.utils.toBN(expectedWeiBalance);

    await web3.eth.sendTransaction({
      from: accounts[0],
      to: receiver,
      value: weiValueToSend
    });

    let weiBalance = await web3.eth.getBalance(receiver);
    weiBalance = web3.utils.toBN(weiBalance);
    assert(weiBalance.lte(expectedWeiBalance), `Send failed, end balance: ${weiBalance}`)
  });
});
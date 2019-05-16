const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

describe('geth-dev-assistant', function(){

  it('creates five new accounts (1 original, 5 new)', async function(){
    const accounts = await web3.eth.getAccounts();
    assert(accounts.length === 6, `Missing accounts, total # = ${accounts.length}`)
  });

  it('accounts have a starting balance of 50 eth', async function(){
    const accounts = await web3.eth.getAccounts();

    let expectedWeiBalance = web3.utils.toWei('50', 'ether');
    expectedWeiBalance = web3.utils.toBN(expectedWeiBalance);

    for (let [ index, account ] of accounts.entries() ){
      if (index){
        let weiBalance = await web3.eth.getBalance(account);
        weiBalance = web3.utils.toBN(weiBalance);
        assert(weiBalance.eq(expectedWeiBalance), `Bad starting balance: ${weiBalance}`)
      }
    }
  });

  it('accounts are unlocked & can transact', async function(){
    const accounts = await web3.eth.getAccounts();
    const weiValueToSend = web3.utils.toWei('1', 'ether');

    let expectedWeiBalance = web3.utils.toWei('49', 'ether');
    expectedWeiBalance = web3.utils.toBN(expectedWeiBalance);

    for (let [ index, account ] of accounts.entries() ){
      if (index){
        await web3.eth.sendTransaction({
          from: account,
          to: accounts[0],
          value: weiValueToSend
        });

        let weiBalance = await web3.eth.getBalance(account);
        weiBalance = web3.utils.toBN(weiBalance);
        assert(weiBalance.lte(expectedWeiBalance), `Send failed, end balance: ${weiBalance}`)
      }
    }
  });
})
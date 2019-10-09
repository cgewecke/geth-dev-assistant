const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

describe('auto-mining [ @period ]', function(){
  it('should automine when period is > 0', async function(){
    let counter = 0;
    await new Promise((resolve, reject) => {
      let oldBlock = 0;

      const interval = setInterval(async () => {
        const block = await web3.eth.getBlock('latest');

        if (block.number <= oldBlock){
          clearInterval(interval);
          reject('Blocks are not increasing as expected...');
        }

        oldBlock = block.number;

        counter++;
        if (counter === 3){
          clearInterval(interval);
          resolve();
        }
      }, 1500);

    });
  });

});
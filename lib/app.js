const Web3 = require('web3');
const child = require('child_process');
const c = require('colors');
const emoji = require('node-emoji');
const gethCommand = require('./geth.js');
const log = console.log;

let web3;


/**
 * Launches a docker geth client in the background
 * @param  {Object} config options passed to command
 * @return {Promise}
 */
async function launch(config){
  if (!config.launch) return;

  // Pull client
  if (config.offline === undefined){
    report('pull', config);
    try {
      child.execSync(`docker pull ${config.repo}:${config.tag}`)
    } catch (err) {
      log(err);
      process.exit(1);
    }
  }

  // Launch
  report('launch', config);
  const geth = child.exec(gethCommand(config));

  geth.on('error', data => {
    log(data);
    process.exit(1);
  });

  geth.stderr.on('data', data => {
    log(data);
    process.exit(1);
  })
}

/**
 * Waits argv.sleep ms for client to spin up & tests connection
 * while getting address of geth's default unlocked, funded account;
 * @param  {Object} config options passed to command
 * @return {Promise}
 */
async function connect(config){

  report('sleep', config);
  await new Promise((resolve) => setTimeout(()=> resolve(), config.sleep));

  report('connect', config);
  try {
    config.accountZero = (await web3.eth.getAccounts())[0];
  } catch (err) {
    const knownError = err.message.includes('refused') || err.message.includes('JSON RPC');
    knownError && report('noConnect', config);
    throw err;
  }
}

/**
 * Creates and permanently unlocks argv.accounts number of accounts
 * using argv.password
 * @param  {Object} config options passed to command
 * @return {Promise}
 */
async function createAccounts(config) {

  report('create', config);

  for (var i = 0; i < config.accounts; i++) {
    const account = await web3.eth.personal.newAccount(config.password);
    await web3.eth.personal.unlockAccount(account, config.password, 0);
    report('new', config, account);
  }
}

/**
 * Spins an insta-mining client with no-op transactions until the
 * target gas limit (argv.gasLimit) is acheived. If --dev.period is
 * greater than 0, this isn't strictly necessary but the gas limit
 * checks in this fn should work anyway.
 *
 * @param  {Object} config options passed to command
 * @return {Promise}
 */
async function reachGasLimit(config){

  // Status report
  let block = await web3.eth.getBlock('latest');

  report('mine', config, config.gasLimit - block.gasLimit);

  const poll = setInterval(() => {
    report('mine', config, config.gasLimit - block.gasLimit)
  }, 8000);

  // Send no-ops
  while (config.gasLimit > block.gasLimit ){
    await web3.eth.sendTransaction({
      from: config.accountZero,
      to: config.accountZero,
      value: web3.utils.toWei('0', 'ether'),
    });

    block = await web3.eth.getBlock('latest');
  }

  // Cleanup
  clearInterval(poll);
}

/**
 * Sends argv.balance ether from geth's account[0] to each argv.account
 * @param  {Object} config options passed to command
 * @return {Promise}
 */
async function fundAccounts(config){

  report('fund', config);

  const weiBalance = web3.utils.toWei(`${config.balance}`, 'ether');
  const accounts = await web3.eth.getAccounts();

  for (let [index,account] of accounts.entries()){

    await web3.eth.sendTransaction({
      from: config.accountZero,
      to: account,
      value: weiBalance
    })

    config.currentAccount = account;

    (index)
      ? report('account', config, index)
      : report('accZero', config, index)
  }
}

/**
 * Messages.
 * @param  {String} kind   descriptive key
 * @param  {String} config context
 * @param  {Object} info   [optional] additional info like errors
 * @return {Error}
 */
function report(kind, config, info){

  const ct = c.green.bold('>');
  const kinds = {

    pull:      `${ct} ${c.bold(`Pulling ethereum/client-go:${config.tag}`)}`,
    sleep:     `${ct} ${c.bold(`Sleeping for ${config.sleep} ms while geth launches.`)}`,
    connect:   `${ct} ${c.bold(`Connecting to client at ${config.url}`)}`,
    create:    `${ct} ${c.bold(`Creating / unlocking ${config.accounts} new accounts.`)}`,
    new:       `${ct} ${info}`,
    fund:      `${ct} ${c.bold(`Funding ${config.accounts} new accounts`)}`,
    accZero:   `${ct} [${info}] ${config.currentAccount}   ${c.green(`∞ ETH`)}`,
    account:   `${ct} [${info}] ${config.currentAccount}   ${c.green(`${config.balance} ETH`)}`,
    mine:      `${ct} ${c.bold(`Mining towards gas target`)} ${c.red(`(gap = ${info})`)}`,
    ready:     `${ct} ${c.green(`Geth is ready now.`)}`,

    launch:    `${ct} :warning:  ${c.bold(`Launching `)}` +
               `${c.bold(`ethereum/client-go:${config.tag} as a background process. :warning: \n`)}` +
               `${ct} :warning:  ${c.bold(`Run ${c.bold.grey(`docker stop geth-client `)}`)}` +
               `${c.bold(`when you are finished testing.   :warning:`)}`,

    noConnect: `Unable to connect at ${config.url}.\n` +
               `  + Is geth running? (use --launch to do this automatically)\n` +
               `  + Make sure correct ports/protocols are open on geth.\n` +
               `  + Try increasing the 'sleep' option to give geth more time to launch.\n\n`,
  }

  console.log(emoji.emojify(kinds[kind]));
}

/**
 * Does some setup and executes laundry list
 * @param  {Object} config  from yarg's argv (see index.js)
 * @return {Promise}
 */
async function app(config){

  config.currentAccount = '';
  config.url = `${config.protocol}://localhost:${config.port}`
  web3 = new Web3(config.url);

  try {

    await launch(config);
    await connect(config);
    await createAccounts(config);
    await fundAccounts(config);
    await reachGasLimit(config);
    report('ready', config);

  } catch (err) {
    log(err);
    process.exit(1)
  }
}

module.exports = app;

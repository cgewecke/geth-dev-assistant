
const geth = function(config){

  return `` +
    `docker run ` +
    `-i ` +
    `-p ${config.port}:${config.port} ` +
    `-p 30303:30303 ` +
    `--name 'geth-client' ` +
    `--rm ` +
    `${config.repo}:${config.tag} ` +
    `--rpc ` +
    `--rpcaddr '0.0.0.0' ` +
    `--rpcport ${config.port} ` +
    `--rpccorsdomain '*' ` +
    `--rpcapi personal,web3,eth,admin,debug,miner,txpool,net ` +
    `--nodiscover ` +
    `--allow-insecure-unlock ` +
    `--dev ` +
    `--dev.period ${config.period} ` +
    `--targetgaslimit ${config.gasLimit} `
}

module.exports = geth;
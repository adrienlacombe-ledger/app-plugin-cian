import { waitForAppScreen, zemu, genericTx, nano_models, SPECULOS_ADDRESS, pluginName, jestTimeOut, optimism_network, ledgerPath } from '../test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";

const contractAddr = "0x907883da917ca9750ad202ff6395c4c6ab14e60e";
const testNetwork = optimism_network;
const abi_path = `../../networks/${testNetwork.name}/${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

nano_models.forEach(function (model) {
  jest.setTimeout(jestTimeOut)
  test('[Nano ' + model.letter + " " + testNetwork.name + '] Vault Deposit Wsteth', zemu(model, testNetwork.name, async (sim, eth) => {
    const contract = new ethers.Contract(contractAddr, abi);
    const amount = parseUnits("3000322493818019081", 'wei');
    const to = SPECULOS_ADDRESS;
    const { data } = await contract.populateTransaction.deposit(amount, to);
    let unsignedTx = genericTx;
    unsignedTx.to = contractAddr;
    unsignedTx.chainId = testNetwork.chainId;
    unsignedTx.data = data;
    unsignedTx.value = parseEther("0");
    const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);
    const tx = eth.signTransaction(ledgerPath, serializedTx);
    const right_clicks = model.letter === 'S' ? 7 : 5;
    await waitForAppScreen(sim);
    await sim.navigateAndCompareSnapshots('.', testNetwork.name + '/' + model.name + '_vault_deposit_wsteth', [right_clicks, 0]);
    await tx;
  }));
});


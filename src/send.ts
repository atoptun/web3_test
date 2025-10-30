import "dotenv/config";
import { JsonRpcProvider, Wallet, parseUnits } from "ethers";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";


type SendOptions = {
  rpcUrl: string;
  privateKey: string;
  to: string;
  amount: string;
  confirms?: number;
};

const argv = yargs(hideBin(process.argv))
  .usage("$0 --private-key <key> --to <address> --amount <amount>")
  .options({
    "private-key": { type: "string", demandOption: false, alias: "k", describe: "Sender private key" },
    to: { type: "string", demandOption: true, alias: "t", describe: "Recipient public key" },
    amount: { type: "string", demandOption: true, alias: "a", describe: "Amount to send" },
  })
  .help()
  .alias("help", "h")
  .parseSync();


async function sendToken(sendOpts: SendOptions) {
  const provider = new JsonRpcProvider(sendOpts.rpcUrl);
  const wallet = new Wallet(sendOpts.privateKey, provider);
  const amountUnits = parseUnits(sendOpts.amount, "ether");
  const tx = await wallet.sendTransaction({ 
    to: sendOpts.to, 
    value: amountUnits 
  });
  const receipt = await tx.wait(sendOpts.confirms ?? 1);
  return receipt;
}


async function main(): Promise<void> {
  console.log("\nToken sender starting...");

  const privateKey = argv["private-key"] as string;
  const rpcUrl = process.env.RPC_URL;
  const to = argv.to as string;
  const amount = argv.amount as string;

  if (!privateKey || !rpcUrl || !to || !amount) {
    throw new Error("Wrong parameters.");
  }

  const sendOpts: SendOptions = {
    rpcUrl,
    privateKey,
    to,
    amount,
  };
  console.log(`From: ${privateKey}\nTo: ${to}\nAmount: ${amount}`);

  try {
    const receipt = await sendToken(sendOpts);
    if (!receipt) {
      throw new Error("No receipt returned");
    }

    console.log("\nSuccess!");
    console.log(`TX hash: ${receipt.hash}`);
  } catch (error: any) {
    console.error("\nError occurred:");
    if (error.code === "INSUFFICIENT_FUNDS") {
      console.error("Insufficient funds.");
    } else if (error.code === "INVALID_ARGUMENT") {
      console.error("Invalid argument.");
    } else {
      console.error(error.message ?? error.toString());
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});

const borsh = require("@coral-xyz/borsh");
const { Connection, PublicKey } = require("@solana/web3.js");
const { Buffer } = require("buffer");

// Guardian setting schema (copy from your main code)
const guardianSettingSchema = borsh.struct([
  borsh.u32("seed"),
  borsh.publicKey("guardianCertificate"),
  borsh.publicKey("assetMint"),
  borsh.publicKey("tokenProgramId"),
  borsh.publicKey("splTokenMintAuthority"),
  borsh.publicKey("splTokenBurnAuthority"),
]);

async function main() {
    const accountAddress = "B5G5UDeRLWjJhcBVkH2rGAb5i274EM8NmQLKGVJ4aXEY";
    const rpcUrl = "https://api.devnet.solana.com";
  const connection = new Connection(rpcUrl);
  const accountInfo = await connection.getAccountInfo(new PublicKey(accountAddress));
  if (!accountInfo || !accountInfo.data) {
    console.error("No data found for guardian setting account");
    process.exit(1);
  }
  // Try decoding with no offset (not Anchor)
  try {
    const decoded = guardianSettingSchema.decode(accountInfo.data);
    console.log("Decoded guardian setting account:", decoded);
    console.log("assetMint (base58):", decoded.assetMint.toBase58());
    console.log("assetMint (hex):", Buffer.from(decoded.assetMint.toBytes()).toString("hex"));
  } catch (err) {
    console.error("Error decoding account data:", err);
    process.exit(1);
  }
}

main(); 
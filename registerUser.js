const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

async function registerAndEnrollUser(username) {
  try {
    // 1. Load the network configuration from connection profile
    const ccpPath = path.resolve(__dirname, process.env.FABRIC_CONNECTION_PROFILE); // e.g., 'connection-org1.json'
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // 2. Create a new CA client for interacting with the CA
    const caInfo = ccp.certificateAuthorities[process.env.FABRIC_CA_NAME]; // e.g., 'ca.org1.example.com'
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, {
      trustedRoots: caTLSCACerts,
      verify: false,
    }, caInfo.caName);

    // 3. Create a new file system wallet for managing identities
    const walletPath = path.resolve(__dirname, process.env.FABRIC_WALLET_PATH || 'wallet'); // fallback to local 'wallet'
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // 4. Check if user already exists
    const userIdentity = await wallet.get(username);
    if (userIdentity) {
      console.log(`An identity for the user "${username}" already exists in the wallet`);
      return;
    }

    // 5. Check if admin identity exists
    const adminIdentity = await wallet.get(process.env.FABRIC_ADMIN_ID || 'admin');
    if (!adminIdentity) {
      throw new Error('Admin identity not found in wallet. Please enroll the admin first.');
    }

    // 6. Build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, process.env.FABRIC_ADMIN_ID || 'admin');

    // 7. Register, enroll and import the identity into the wallet
    const secret = await ca.register({
      affiliation: process.env.FABRIC_AFFILIATION, // e.g., 'org1.department1'
      enrollmentID: username,
      role: 'client',
    }, adminUser);

    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: process.env.FABRIC_MSP_ID, // e.g., 'Org1MSP'
      type: 'X.509',
    };

    await wallet.put(username, x509Identity);
    console.log(`✅ Successfully registered and enrolled user "${username}" into the wallet`);
  } catch (error) {
    throw new Error(`❌ Failed to register user "${username}": ${error.message}`);
  }
 (error) 
  console.error(`Fabric error: ${error.message}`);
  throw new Error(`Failed to register user "${username}": ${error.message}`);
}


module.exports = { registerAndEnrollUser };

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const path = require('path');

async function enrollAdmin() {
  try {
    // CA server URL
    const caURL = 'http://localhost:7054';
    const ca = new FabricCAServices(caURL);

    // Wallet path
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if admin already exists in wallet
    const adminExists = await wallet.get('admin');
    if (adminExists) {
      console.log('Admin identity already exists in the wallet');
      return;
    }

    // Enroll the admin user with CA
    const enrollment = await ca.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw', // this matches your CA start -b admin:adminpw
    });

    // Create the identity object
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP', // replace with your MSP ID
      type: 'X.509',
    };

    // Put identity into wallet
    await wallet.put('admin', x509Identity);
    console.log('Successfully enrolled admin user and imported into wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user: ${error}`);
  }
}

enrollAdmin();

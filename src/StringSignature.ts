import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

interface SignatureResult {
  messageHash: string;
  signatureString: string;
}

async function signMessageWithPrivateKey(message: string, privateKey: string): Promise<SignatureResult> {
  // Hash the message
    const messageHash = ethers.utils.hashMessage(message);

    // Sign the message hash
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const signature = signingKey.signDigest(messageHash);
    const signatureString = ethers.utils.joinSignature(signature);    

    return {messageHash, signatureString};
}
// Usage example
const privateKey = process.env.PRIVATE_KEY as string;
const message = 'Hello, World!';

signMessageWithPrivateKey(message, privateKey)
  .then(({messageHash, signatureString}) => {
    console.log('Hash:', messageHash);
    console.log('Signature:', signatureString);
  })
  .catch((error: Error) => {
    console.error('Error:', error);
  });

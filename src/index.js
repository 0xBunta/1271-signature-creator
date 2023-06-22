import { ethers } from 'ethers';

async function signMessageWithPrivateKey(message, privateKey) {    
    // Hash the message
    const messageHash = ethers.utils.hashMessage(message);

    // Sign the message hash
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const signature = signingKey.signDigest(messageHash);
    const signatureString = ethers.utils.joinSignature(signature);    

    return {messageHash, signatureString};
}
// Usage example
const privateKey = 'INSERT_PRIVATE_KEY_HERE';
const message = 'Hello, World!';

signMessageWithPrivateKey(message, privateKey)
  .then(({messageHash, signatureString}) => {
    console.log('Hash:', messageHash);
    console.log('Signature:', signatureString);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

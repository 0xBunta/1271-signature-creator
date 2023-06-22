import { constants, ethers } from 'ethers';
import { CollectionType, Maker, QuoteType } from "@looksrare/sdk-v2";
import dotenv from 'dotenv';

dotenv.config();

async function createMockMakerOrder(): Promise<Maker> {
    const provider = ethers.getDefaultProvider();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    const now = block.timestamp;
    const makerOrder: Maker = {
        quoteType: QuoteType.Ask,
        globalNonce: 0,
        subsetNonce: 0,
        orderNonce: 0,
        strategyId: 0,
        collectionType: CollectionType.ERC721,
        collection: constants.AddressZero,
        currency: constants.AddressZero,
        signer: process.env.PUBLIC_KEY as string,
        startTime: now,
        endTime: now + 86400, // 1 day validity
        price: constants.WeiPerEther, // 1 ETH
        itemIds: ["1"],
        amounts: ["1"],
        additionalParameters: constants.HashZero,
    };

    return makerOrder
}

function hash(makerOrder: Maker) {
    const _MAKER_TYPEHASH = ethers.utils.id("Maker(string,uint256,uint256,uint256,uint256,string,address,address,address,uint256,uint256,uint256,uint256[],uint256[],bytes)");

    const part1 = ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'string', 'uint256', 'uint256', 'uint256', 'uint256', 'string', 'address', 'address', 'address'],
        [_MAKER_TYPEHASH, makerOrder.quoteType, makerOrder.globalNonce, makerOrder.subsetNonce, makerOrder.orderNonce, makerOrder.strategyId, makerOrder.collectionType, makerOrder.collection, makerOrder.currency, makerOrder.signer]
    );

    const part2 = ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'uint256', 'uint256[]', 'uint256[]', 'bytes'],
        [makerOrder.startTime, makerOrder.endTime, makerOrder.price, makerOrder.itemIds, makerOrder.amounts, makerOrder.additionalParameters]
    );

    const data = ethers.utils.arrayify(part1 + part2.slice(2)); // remove '0x' from the second part
    return ethers.utils.keccak256(data);
}

async function signMessageWithPrivateKey(message: string, privateKey: string) {    
    // Hash the message
    const messageHash = ethers.utils.hashMessage(message);

    // Sign the message hash
    const signingKey = new ethers.utils.SigningKey(privateKey);
    const signature = signingKey.signDigest(messageHash);
    const signatureString = ethers.utils.joinSignature(signature);    

    return {messageHash, signatureString};
}

async function signMakerOrderWithPrivateKey() {
    const privateKey = process.env.PRIVATE_KEY as string;
    const message = hash(await createMockMakerOrder());

    const {messageHash, signatureString} = await signMessageWithPrivateKey(message, privateKey);
    console.log('Hash:', messageHash);
    console.log('Signature:', signatureString);
}

signMakerOrderWithPrivateKey();
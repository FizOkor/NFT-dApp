import { ethers } from "ethers";
import NFT_ABI from "./abi.json";
import { CONTRACT_ADDRESS } from "./contract.js";

export const getNFTContract = (provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI, provider);
};

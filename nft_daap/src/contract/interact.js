import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getNFTContract } from "./getContract.js";
import abi from "./abi.json";
import { CONTRACT_ADDRESS } from "./contract.js";


export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }]
    });

    // account picker
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts", // account selection
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No account selected");
    }

    const selectedAccount = accounts[0]; 

    return selectedAccount;
  } catch (error) {
    console.error("Connection failed:", error);

    if (error.code === 4001) {
      alert("Connection rejected - please connect to continue");
    } else {
      alert("Failed to connect wallet");
    }

    return null;
  }
};

export const getCurrentWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        return accounts[0];
      }
      console.error("No accounts found");
      return null;
    } catch {
      console.error("Connect Wallet");
      return null;
    }
  } else {
    console.warn("Ethereum provider not found, Please Install Metmask!");
    return null;
  }
};

export const mintNFT = async (addr, metadataUrl) => {
  try{
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    // listen for 'NFTMinted' event

    const tx = await contract.mintNFT(addr, metadataUrl);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map(log => contract.interface.parseLog(log))
      .find(parsed => parsed?.name === "NFTMinted");

    const tokenId = event?.args?.tokenId?.toString();
    
    const viewLink = `sepolia-blockscout.lisk.com/token/${CONTRACT_ADDRESS}/instance/${tokenId}`;
    return viewLink;
  }catch (err) {
    throw new Error('Minting Failed');
  }
}


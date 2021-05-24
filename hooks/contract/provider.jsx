import React, { useEffect, useState } from "react";
import ContractContext from "./context";
import { ethers, utils } from "ethers";
import nftShopAbi from "../../contracts/NftShop/NftShop.json";

const nftShopContractAddress = "0xC48140E34B2d38e87E66317A22697514Fb0D54d4";

const ContractProvider = ({ children }) => {
	const [account, setAccount] = useState();
	const [contract, setContract] = useState();

	useEffect(() => {
		if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
			loadContract();
		}
	}, []);

	async function getAccount() {
		// Metamask already opened
		if (account) {
			console.log("Getting existent account");
			return account;
		}
		// Open metamask window
		console.log("Requesting user account");
		const response = await window.ethereum.request({ method: "eth_requestAccounts" });
		setAccount(response.account);
		return account;
	}

	async function loadContract() {
		const nftShopInterface = new utils.Interface(nftShopAbi);
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(nftShopContractAddress, nftShopInterface, signer);
		console.log("contract", contract);
		setContract(contract);
	}

	return <ContractContext.Provider value={{ contract, getAccount }}>{children}</ContractContext.Provider>;
};

export default ContractProvider;

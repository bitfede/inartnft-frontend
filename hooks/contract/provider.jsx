import React, { useEffect, useState } from "react";
import ContractContext from "./context";
import { ethers, utils } from "ethers";
import nftShopAbi from "../../contracts/NftShop/NftShop.json";
import settings from "../../settings";

const ContractProvider = ({ children }) => {
	const [account, setAccount] = useState();
	const [contract, setContract] = useState();

	useEffect(() => {
		if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
			loadContract();
		}
	}, []);

	async function getAccountAsync() {
		// Metamask already opened
		if (account) {
			console.log("Getting existent account");
			return account;
		}
		// Open metamask window
		console.log("Requesting user account");
        //purtroppo qua mi da errore window not defined
		const response = await window.ethereum.request({ method: "eth_requestAccounts" });
		setAccount(response.account);
		return account;
	}

	async function loadContract() {
		const nftShopContractAddress = settings.Contract.Address;
		const nftShopInterface = new utils.Interface(nftShopAbi);
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(nftShopContractAddress, nftShopInterface, signer);
		console.log("contract", contract);
		setContract(contract);
	}

	return <ContractContext.Provider value={{ contract, getAccountAsync }}>{children}</ContractContext.Provider>;
};

export default ContractProvider;

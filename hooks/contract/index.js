import { useContext } from "react";
import Provider from "./provider";
import ContractContex from "./context";

export const useContract = () => useContext(ContractContex);

export const ContractProvider = Provider;

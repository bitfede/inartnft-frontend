import React, { useState, useEffect } from "react";
import ContractContext from "./context";

import { InjectedConnector } from "@web3-react/injected-connector";
import httpClient from '../../utilities/http-client';

//hooks
import { useEthers } from "@usedapp/core";

//global variables

// Provider
const ContractProvider = ({ children }) => {
    
    //state
   
    //hooks


    // useEffect functions
  
    //functions

	return (
        <ContractContext.Provider value={{ }}>
            {children}
        </ContractContext.Provider>
    );
};

export default ContractProvider;

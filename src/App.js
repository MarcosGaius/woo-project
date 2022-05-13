import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x43ce82d1D75D89f560Ea3044BB69eaaEF88Cc438";
  const contractABI = abi.abi;

  const checkWalletConnected = async () => {
    try {
      const {ethereum} = window;
    
      if(!ethereum){
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } 
      else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({method: "eth_accounts"});

      if(accounts.length !== 0){
        const account = accounts[0];
        console.log("Encontrada a conta autorizada: ", account);
        setCurrentAccount(account);
      }
      else {
        console.log("Nenhuma conta autorizada foi encontrada!")
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum){
        alert("Metamask não encontrada!");
        return;
      }

      // const progBar = document.createElement("div").classList.add("progress-container");
      // progBar.appendChild("div").classList.add("progress-bar");
      // document.getElementsByClassName("dataContainer").insertAdjacentHTML("beforeend", progBar);

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Conectado", accounts[0]);
      document.getElementById("metaCon").remove;
    }
    catch(error){
      console.log(error);
    }
  }

  const woo = async () => {
    try {
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let wooCount = await wooPortalContract.getTotalWoo();
        console.log("Número de Woo's: ", wooCount.toNumber());

        const wooTxn = await wooPortalContract.woo();
        console.log("Minerando...", wooTxn.hash);

        await wooTxn.wait();
        console.log("Minerado -- ", wooTxn.hash);

        wooCount = await wooPortalContract.getTotalWoo();
        console.log("Número de Woo's: ", wooCount.toNumber());
      }
      else {
        console.log("Objeto Ethereum não encotrado.");
      }

    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    checkWalletConnected();
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        💫 Fala ae, pessoal!
        </div>

        <div className="bio">
        Eu sou o Marcos ou Gaius, tanto faz... Conecta aí sua carteira Ethereum Wallet e faz o Woo!
        </div>

        <button className="wooButton" onClick={woo}>
          Woooooooooo 🎉
        </button>

        {!currentAccount && (
          <button className="wooButton" id="metaCon" onClick={connectWallet}>
            Conectar carteira 🦊
          </button>
        )}

        <div className="progressContainer">
          <div className="progressBar"></div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWoo, setAllWoo] = useState([]);
  const contractAddress = "0x64cf7F997Fd0eDda64bBb30c8a8Bc0461923FC59";
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
        getAllWoo();
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

      const dataContainer = document.querySelector(".dataContainer");
      console.log(dataContainer);

      const progContainer = document.createElement("div");
      progContainer.classList.add("progressContainer");
      dataContainer.appendChild(progContainer);

      const progBar = document.createElement('div');
      progBar.classList.add("progressBar");
      progContainer.appendChild(progBar);

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Conectado", accounts[0]);
      progContainer.remove();
      document.getElementById("metaCon").remove();
    }
    catch(error){
      console.log(error);
      document.querySelector(".progressContainer").remove();
    }
  }

  const getAllWoo = async () => {
    try {
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const woos = wooPortalContract.getAllWoo();
        const treatedWoos = [];

        woos.forEach(arrElem => {
            treatedWoos.push({
              address: arrElem.waver,
              timestamp: new Date(arrElem.timestamp * 1000),
              message: arrElem.message
            });
        });

        setAllWoo(treatedWoos);
        console.log(treatedWoos);
      }
      else {
        console.log("O objeto ethereum não existe!");
      }

    }
    catch(error){
      console.error(error);
    }
  }

  const woo = async () => {
    try {
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        //adicionar um input pra colocar o texto!

        let wooCount = await wooPortalContract.getTotalWoo();
        console.log("Número de Woo's: ", wooCount.toNumber());

        const wooTxn = await wooPortalContract.woo("MENSAGEM TESTE A SER MUDADA");
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

        {allWoo.map((woo, i) => {
          return (
            <div key={i} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {woo.address}</div>
              <div>Data/Horário: {woo.timestamp.toString()}</div>
              <div>Mensagem: {woo.message}</div>
            </div>
          )
        })};
      </div>
    </div>
  );
}

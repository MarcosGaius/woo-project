import React, { useEffect, useState } from "react";
//import { ethers } from "ethers";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

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
        alert("Metamask encontrada!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Conectado", accounts[0]);
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    checkWalletConnected();
  }, []);

  const woo = () => {
    
  }
  
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
          <button className="wooButton" onClick={connectWallet}>
            Conectar carteira 🦊
          </button>
        )}
      </div>
    </div>
  );
}

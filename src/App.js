import React, { useEffect } from "react";
//import { ethers } from "ethers";
import './App.css';

export default function App() {

  const checkWalletConnected = () => {
    const {ethereum} = window;
    
    if(!ethereum){
      console.log("Garanta que possua a Metamask instalada!");
      return;
    } 
    else {
      console.log("Temos o objeto ethereum", ethereum);
    }

    useEffect(() => {
      checkWalletConnected();
    }, []);
  }

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
      </div>
    </div>
  );
}

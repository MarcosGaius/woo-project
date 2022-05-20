import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import { parseUnits } from "ethers/lib/utils";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWoo, setAllWoo] = useState([]);
  const contractAddress = "0x0BF75065BeE34555415eBC073c5fb706d03463b4";
  const contractABI = abi.abi;

  const formatDate = (timestamp) => {
    const monthArr = ['Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'];

      const dayArr = [ 'Domingo',
      'Segunda-Feira',
      'Terça-Feira',
      'Quarta-Feira',
      'Quinta-Feira',
      'Sexta-Feira',
      'Sábado'];

      let date = new Date(timestamp);
      let dia = date.getDate();
      let diaSemana = dayArr[date.getDay()];
      let mes = monthArr[date.getMonth()];
      let ano = date.getFullYear();
      let horas = date.getHours();
      let min = date.getMinutes();
      let seg = date.getSeconds();


      return `Dia ${dia} de ${mes} de ${ano} às ${horas}:${min}:${seg} | ${diaSemana}`
  };

  const showModal = (errorStr) => {
    let modal = document.getElementById('messageModal');
    modal.style.display = "flex";
    if(errorStr){

    }
  }

  const closeModal = () => {
    let modal = document.getElementById('messageModal');
    modal.style.display = "none";
  }

  const showPopup = (message) => {
    let popup = document.querySelector(".popupModal");
    popup.style.display = "flex";
    if(message){
      let popupMessage = document.getElementById("error-message");
      popupMessage.innerText = message;
    }
  }
  
  const closePopup = () => {
    let popup = document.querySelector(".popupModal");
    popup.style.display = "none";
  }

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
      getAllWoo();
    }
    catch(error){
      console.log(error);
      document.querySelector(".progressContainer").remove();
    }
  }

  const getAllWooBack = async (id) => {
    try {
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const woosBack = await wooPortalContract.getAllWooBack(id);
        
        console.log("Woos Back: ", woosBack.toNumber());
        return woosBack.toNumber();
      }
      else {
        console.log("O objeto ethereum não existe!");
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const getAllWoo = async () => {
    try {
      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const woos = await wooPortalContract.getAllWoo();
        const treatedWoos = [];

        for(const wooElem of woos){
          const wooback = await getAllWooBack(wooElem.id);
          treatedWoos.push({
            id: wooElem.id,
            address: wooElem.waver,
            timestamp: formatDate(wooElem.timestamp * 1000),
            message: wooElem.message,
            wooback: wooback
          });
        }

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

        const messageInput = await document.getElementById('message-input').value
        const loadingContainer = document.querySelector('.loadContainer');
        const loadingText = document.querySelector('.loadingText');

        let wooCount = await wooPortalContract.getTotalWoo();
        console.log("Número de Woo's: ", wooCount.toNumber());

        const wooTxn = await wooPortalContract.woo(messageInput, {gasLimit: 300000});
        console.log("Minerando...", wooTxn.hash);

        loadingContainer.style.display = "flex";
        loadingText.innerText = "Minerando...";

        await wooTxn.wait();
        console.log("Minerado -- ", wooTxn.hash);
        loadingContainer.style.display = "none";

        wooCount = await wooPortalContract.getTotalWoo();
        console.log("Número de Woo's: ", wooCount.toNumber());
        
        //getAllWoo();
      }
      else {
        console.log("Objeto Ethereum não encotrado.");
      }

    }
    catch(error){
      closeModal();
      if(error.message){
        showPopup(error.message);
      }
      if(error.receipt.status == 0){
          showPopup("Você deve esperar 10 minutos para enviar outro Woo.")
          return;
      }
      else {
        throw error;
      }
    }
  }
  
  const wooBack = async (id) => {
    try {
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const wooBackTxn = await wooPortalContract.wooBack(id);
        console.log("Minerando...", wooBackTxn.hash);

        await wooBackTxn.wait();
        console.log("Minerado --", wooBackTxn.hash);
        getAllWoo();
      }
    }
    catch(error){
      console.log("Erro no wooBack ", error);
      showPopup(error.error.message);
    }    
  }

  useEffect(() => {
    checkWalletConnected();
    
    let wooPortalContract;
 
    const onNewWoo = (id, sender, timestamp, message, woobacks) => {
      console.log("newWave", id, sender, timestamp, message, woobacks);
      setAllWoo (prevState => [
        ...prevState,
        {
          id: id,
          address: sender,
          timestamp: formatDate(timestamp * 1000), //new Date(timestamp * 1000),
          message: message,
          wooback: woobacks.toNumber()
        },
      ]);
    };

    getAllWoo();

    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wooPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wooPortalContract.on("newWave", onNewWoo);
    }

    return () => {
      if(wooPortalContract){
        wooPortalContract.off("newWave", onNewWoo);
      }
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="headerContainer">
        <div className="headerLogo">💫 Woo Portal</div>
        <div className="headerOptions">
          <a href="https://metamask.io" target="_blank">Metamask</a>
          <a href="https://rinkebyfaucet.com" target="_blank">Faucet (ETH na Rinkeby)</a>
          {/* <div>Início</div>
          <div>Sobre</div> */}
        </div>
      </div>

      <div className="dataWrapper">
        <div className="dataContainer">
          <div className="header">
          💫 Fala ae, pessoal!
          </div>

          <div className="bio">
          Basicamente, você consegue fazer o Woo e responder com o Woo Back por aqui. Masss, além disso, você consegue enviar uma mensagem no seu Woo! Então aproveita e deixa sua mensagem marcada na Blockchain aí 😎
          <br></br><br></br>
          Não esquece de conectar sua Metamask e estar na rede Rinkeby (Rede de testes) 👀
          </div>

          <button className="wooButton" onClick={showModal}>
          Woooooooooo 🎉
          </button>

          {!currentAccount && (
            <button className="wooButton" id="metaCon" onClick={connectWallet}>
              Conectar carteira 🦊
            </button>
          )}

          <div className="messageModal" id="messageModal">
            <div className="modalWrapper">
              <div className="modalContent">
                <p>Insira sua mensagem abaixo:
                  <span className="closeButton" onClick={closeModal}>&times;</span>
                </p>
                <div className="loadContainer">
                  <div className="loadingButton"></div>
                  <div className="loadingText"></div>
                </div>
                <input type="text" id="message-input" name="message-input" placeholder="Um link, uma homenagem, uma mensagem?"></input>
                <button onClick={woo}>Enviar</button>
              </div>
            </div>
          </div>

          <div className="popupModal">
            <div className="popupWrapper">
              <div className="popupContent">
                <div className="popupHeader">
                  <p>ERRO</p>
                  <span className="closeButton" onClick={closePopup}>&times;</span>
                </div>
                <div className="popupMessage">
                  <p id="error-message">Erro padrão.</p>
                </div>
              </div>
            </div>
          </div>      

          <div className="messageContainer">
            {allWoo.slice(0).reverse().map((woo, i) => {
              return (
                <div key={i} className="wooMessage">
                  <div><strong>ID:</strong> {woo.id.toNumber()}</div>
                  <div><strong>Endereço:</strong> {woo.address}</div>
                  <div><strong>Data/Horário:</strong> {woo.timestamp.toString()}</div>
                  <div><strong>Mensagem:</strong> {woo.message}</div>
                  <button onClick={() => wooBack(woo.id.toNumber())}>🎉 Woo Back</button>
                  <span>Quantidade de Woo Back: <span>{woo.wooback}</span></span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

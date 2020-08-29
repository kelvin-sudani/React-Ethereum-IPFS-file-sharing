import React, { Component } from "react";

import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const ipfsClient = require("ipfs-http-client");

const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  state = {
    file: null,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    ipfsHash: null,
    buffer: "",
    links: [],
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5000).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  captureFile = (event) => {
    event.preventDefault();
    console.log("event.target.files are here : ", event.target.files);
    this.setState({ file: event.target.files });
    // const file = this.state.file;
    // const reader = new window.FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = () => {
    //   this.setState({ buffer: Buffer(reader.result) });
    //   console.log("buffer", this.state.buffer);
    // };
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    console.log("Submitting file to ipfs... files are:", this.state.file);
    const files = this.state.file;

    for (const [key, value] of Object.entries(files)) {
      console.log(`${key}: ${value}`);
      const file = value;
      console.log("each file", file);
      ipfs.add(file).then((result) => {
        console.log("Ipfs result", result);
        // if (error) {
        //   console.error("error", error);
        //   return;
        // }
        console.log("result cid string", result.cid.toString());
        contract.methods
          .addfile(result.cid.toString())
          .send({ from: accounts[0] })
          .then(async (r) => {
            this.setState({ ipfsHash: result.cid.toString() });
            const filelink = await contract.methods.getfile(key).call();
            this.setState((state) => ({
              links: [
                ...state.links,
                "https://gateway.ipfs.io/ipfs/" + filelink,
              ],
            }));
            // const response = await contract.methods.getfile().call();
            console.log(
              "here is your link: ",
              "https://gateway.ipfs.io/ipfs/" + filelink
            );
          })
          .catch((error) => {
            console.error("error", error);
          });
      });
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div> */}
        <h2>Upload files Below: </h2>
        <form onSubmit={this.onSubmit}>
          <input
            type="file"
            name="input-file"
            id="input-file"
            onChange={this.captureFile}
            multiple
          />
          <br />
          <input type="submit" value="Submit File" />
        </form>
        <h4>Links are here:</h4>
        <div>
          {Array.isArray(this.state.links) && this.state.links.length
            ? this.state.links.map((link) => {
                return (
                  <li>
                    <a href={link} key={link}>
                      {link}
                    </a>
                  </li>
                );
              })
            : "no files are there"}
        </div>
      </div>
    );
  }
}

export default App;

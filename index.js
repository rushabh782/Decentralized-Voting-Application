require("dotenv").config();
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    extended: true,
  })
);
app.use(express.static(__dirname));
app.use(express.json());
const path = require("path");
const ethers = require("ethers");

// Environment variables
const API_URL = process.env.API_URL; // Ensure this points to Volta RPC
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Your private key for signing transactions
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Address of your deployed contract

// Import contract ABI
const { abi } = require("./artifacts/contracts/Voting.sol/Voting.json");

// Explicitly configure the provider for the Volta testnet
const provider = new ethers.providers.JsonRpcProvider({
  url: API_URL,
  chainId: 73799, // Volta Testnet Chain ID
  name: "volta", // Explicitly setting network name
});

// Set up signer using the provider and private key
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Connect to the smart contract
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// Serve index.html when accessing root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve index.html for explicit route
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST request to add candidate
app.post("/addCandidate", async (req, res) => {
  var vote = req.body.vote; // Candidate to be added
  console.log(vote);

  async function storeDataInBlockchain(vote) {
    try {
      console.log("Adding the candidate in voting contract...");
      const tx = await contractInstance.addCandidate(vote);
      await tx.wait(); // Wait for transaction confirmation
      res.send("The candidate has been registered in the smart contract");
    } catch (error) {
      console.error("Error storing data on blockchain: ", error);
      res.status(500).send("Error registering candidate in smart contract");
    }
  }

  try {
    const bool = await contractInstance.getVotingStatus(); // Check if voting is still active
    if (bool) {
      await storeDataInBlockchain(vote); // Store data if voting is active
    } else {
      res.send("Voting is finished");
    }
  } catch (error) {
    console.error("Error retrieving voting status: ", error);
    res.status(500).send("Error checking voting status");
  }
});

// Server listens on specified port
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let WALLET_CONNECTED = "";
let contractAddress = "0xcb4Dc0fc4eBB1264947AEb38Cd329273e13Dda4D";

let contractAbi = [
  {
    inputs: [
      {
        internalType: "string[]",
        name: "_candidateNames",
        type: "string[]",
      },
      {
        internalType: "uint256",
        name: "_durationInMinutes",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllVotesOfCandiates",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "voteCount",
            type: "uint256",
          },
        ],
        internalType: "struct Voting.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRemainingTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateIndex",
        type: "uint256",
      },
    ],
    name: "getVotesOfCandiate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVotingStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateIndex",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingEnd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "votingStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const connectMetamask = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  WALLET_CONNECTED = await signer.getAddress();
  var element = document.getElementById("metamasknotification");
  element.innerHTML = "Metamask is connected " + WALLET_CONNECTED;
};

const addVote = async () => {
  if (WALLET_CONNECTED != 0) {
    var name = document.getElementById("vote");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please wait, adding a vote in the smart contract";
    const tx = await contractInstance.vote(name.value);
    await tx.wait();
    cand.innerHTML = "Vote added !!!";
  } else {
    var cand = document.getElementById("cand");
    cand.innerHTML = "Please connect metamask first";
  }
};

// const addVote = async () => {
//   if (WALLET_CONNECTED !== "") {
//     try {
//       var name = document.getElementById("vote").value; // Ensure this is the correct parameter
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       await provider.send("eth_requestAccounts", []); // Request access to MetaMask
//       const signer = provider.getSigner();

//       const contractInstance = new ethers.Contract(
//         contractAddress,
//         contractAbi,
//         signer
//       );

//       var cand = document.getElementById("cand");
//       cand.innerHTML = "Please wait, adding your vote to the smart contract...";

//       // Cast the vote
//       const tx = await contractInstance.vote(name); // Ensure 'name' is a valid candidate index
//       await tx.wait(); // Wait for transaction confirmation

//       cand.innerHTML = "Vote added successfully!";

//       // Refresh the candidate list after voting
//       await getAllCandidates();
//     } catch (error) {
//       console.error("Error adding vote:", error);
//       var cand = document.getElementById("cand");

//       // Enhanced error handling
//       if (error.code === -32603) {
//         if (error.data && error.data.message) {
//           cand.innerHTML = `Failed to add vote. Reason: ${error.data.message}`;
//         } else {
//           cand.innerHTML =
//             "Failed to add vote. Reason: Unknown internal error.";
//         }
//       } else {
//         cand.innerHTML = `Failed to add vote. Error: ${error.message}`;
//       }
//     }
//   } else {
//     var cand = document.getElementById("cand");
//     cand.innerHTML = "Please connect MetaMask first.";
//   }
// };

const voteStatus = async () => {
  if (WALLET_CONNECTED != 0) {
    var status = document.getElementById("status");
    var remainingTime = document.getElementById("time");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const currentStatus = await contractInstance.getVotingStatus();
    const time = await contractInstance.getRemainingTime();
    console.log(time);
    status.innerHTML =
      currentStatus == 1 ? "Voting is currently open" : "Voting is finished";
    remainingTime.innerHTML = `Remaining time is ${parseInt(time, 16)} seconds`;
  } else {
    var status = document.getElementById("status");
    status.innerHTML = "Please connect metamask first";
  }
};

const getAllCandidates = async () => {
  if (WALLET_CONNECTED != 0) {
    var p3 = document.getElementById("p3");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    p3.innerHTML =
      "Please wait, getting all the candidates from the voting smart contract";
    var candidates = await contractInstance.getAllVotesOfCandiates();
    console.log(candidates);
    var table = document.getElementById("myTable");

    for (let i = 0; i < candidates.length; i++) {
      var row = table.insertRow();
      var idCell = row.insertCell();
      var nameCell = row.insertCell();
      var vc = row.insertCell();

      idCell.innerHTML = i;
      nameCell.innerHTML = candidates[i].name;
      vc.innerHTML = candidates[i].voteCount;
    }

    p3.innerHTML = "The candidate list is updated";
  } else {
    var p3 = document.getElementById("p3");
    p3.innerHTML = "Please connect metamask first";
  }
};

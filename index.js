const ethers = window.ethers;
const connectButton = document.getElementById('connect');
const airdropForm = document.getElementById('airdropForm');
const recipientsInput = document.getElementById('recipients');
const amountInput = document.getElementById('amount');
const mintForm = document.getElementById('mintForm');
const mintAmountInput = document.getElementById('mintAmount');

const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const CONTRACT_ADDRESS = '0xA1f57C9A0CAbE12f665C318bDDC83d9dD26b1C2D';

let signer, contract;

async function connectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log('Connected to MetaMask');
	  console.log('Contract instance:', contract);
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
    }
  } else {
    console.error('MetaMask is not installed');
  }
}

async function airdropTokens(event) {
  event.preventDefault();

  const recipientsStr = recipientsInput.value;
  const amount = amountInput.value;

  if (!recipientsStr || !amount) {
    alert('Please provide recipients and amount');
    return;
  }

  const recipients = recipientsStr.split(',').map(addr => addr.trim());

  try {
    const tx = await contract.airdrop(recipients, ethers.utils.parseUnits(amount, 18));
    await tx.wait();
    alert('Airdrop successful');
  } catch (err) {
    console.error('Error during airdrop:', err);
    alert('Error during airdrop');
  }
}

async function mintTokens(event) {
    event.preventDefault();

    const mintAmount = mintAmountInput.value;

    if (!mintAmount) {
        alert('Please provide an amount to mint');
        return;
    }

    try {
        const tx = await contract.mint(ethers.utils.parseUnits(mintAmount, 18));
        await tx.wait();
        alert('Mint successful');
    } catch (err) {
        // Replace the existing console.error and alert lines with the following:
		console.error('Error during minting:', err.message);
		alert('Error during minting: ' + err.message);

    }
}

connectButton.addEventListener('click', connectMetaMask);
airdropForm.addEventListener('submit', airdropTokens);
mintForm.addEventListener('submit', mintTokens);
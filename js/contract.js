const { ethers, utils } = window.ethers;

let FACTORY_ADDRESS = "0xB1bFa65409a408aA0690255185e7D26BA67e5Cc5";
let CONTRACT_ADDRESS = '0x1D019f3d31B7a05DC952402F5eaF09266d984EAd';

async function deployContract(evt) {
    evt.preventDefault();

    const token = document.querySelector("#deploy-form input[name='token']").value;
    const timestamps = document.querySelector("#deploy-form input[name='timestamps']").value;
    const prices = document.querySelector("#deploy-form input[name='prices']").value;
    const endtime = document.querySelector("#deploy-form input[name='endtime']").value;
    const thresholds = document.querySelector("#deploy-form input[name='thresholds']").value;
    const bonuses = document.querySelector("#deploy-form input[name='bonuses']").value;

    console.log({token});

    const file = await fetch('../contracts/fund-factory.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const factory = new ethers.Contract(FACTORY_ADDRESS, abi, signer);

        console.log({ factory });
        res = await factory.produce(token, timestamps.split(' '), prices.split(' '), endtime, thresholds.split(' '), bonuses.split(' '));
        console.log({res});
        factory.on("Produced", async (from, to) => {
            console.log('contract address', to);
            CONTRACT_ADDRESS = to;
            document.querySelector("#deploy-form p[name='result']").innerHTML = 'Contract is created successfully. Address is ' + to;
        });
    } catch (e) {
        console.log(e);
    }
    
}

async function getProducedList(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#produced-list-form");
    const address = formEl.querySelector("input[name='address']").value;
    console.log({address});

    const file = await fetch('../contracts/fund-factory.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const factory = new ethers.Contract(FACTORY_ADDRESS, abi, signer);

        console.log({ factory });
        arr = await factory.producedList(address);
        let res = '';
        arr.forEach(element => {
            res += element + ' ';
        });
        formEl.querySelector("p[name='result']").innerHTML = res;
    } catch (e) {
        console.log(e);
    }
}

function setContractAddress(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#set-contract-address-form");
    const address = formEl.querySelector("input[name='address']").value;
    CONTRACT_ADDRESS = address;
    console.log(CONTRACT_ADDRESS);
}

async function getConfig(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#get-config-form");

    const file = await fetch('../contracts/fund-contract.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        console.log({ contract });
        res = await contract.getConfig();
        const configObj = {
            _sellingToken: res._sellingToken,
            _timestamps: res._timestamps,
            _prices: res._prices,
            _endTime: res._endTime,
            _thresholds: res._thresholds,
            _bonuses: res._bonuses,
        }
        console.log(configObj);
        formEl.querySelector("pre[name='result']").innerHTML = JSON.stringify(configObj);
    } catch (e) {
        console.log(e);
    }
}

async function getGroupBonus(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#get-group-bonus-form");
    const groupName = formEl.querySelector("input[name='name']").value;
    console.log({groupName});

    const file = await fetch('../contracts/fund-contract.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        console.log({ contract });
        res = await contract.getGroupBonus(groupName);
        console.log(utils.formatUnits(res, 0));
        formEl.querySelector("p[name='result']").innerHTML = utils.formatUnits(res, 0) + '';
    } catch (e) {
        console.log(e);
    }
}

async function setGroup(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#set-group-form");
    const groupName = formEl.querySelector("input[name='name']").value;
    const addresses = formEl.querySelector("input[name='addresses']").value;
    console.log({groupName, addresses});

    const file = await fetch('../contracts/fund-contract.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        console.log({ contract });
        await contract.setGroup(addresses.split(' '), groupName);
    } catch (e) {
        console.log(e);
    }
}

async function getTokenPrice(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#get-token-price-form");

    const file = await fetch('../contracts/fund-contract.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        res = await contract.getTokenPrice();
        console.log(utils.formatUnits(res, 0));
        formEl.querySelector("p[name='result']").innerHTML = utils.formatUnits(res) + 'Ether';
    } catch (e) {
        console.log(e);
    }
}

async function withdrawToken(evt) {
    evt.preventDefault();
    const formEl = document.querySelector("#withdraw-token-form");
    const amount = formEl.querySelector("input[name='amount']").value;
    const address = formEl.querySelector("input[name='address']").value;

    const file = await fetch('../contracts/fund-contract.abi.json');
    const abi = await file.json();

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        await contract.withdraw(amount, address);
    } catch (e) {
        console.log(e);
    }
}

window.addEventListener('load', async () => {
    // Factory
    document.querySelector("#deploy-form").addEventListener("submit", deployContract);
    document.querySelector("#produced-list-form").addEventListener("submit", getProducedList);
    
    // Contract
    document.querySelector("#set-contract-address-form").addEventListener("submit", setContractAddress);
    document.querySelector("#get-config-form").addEventListener("submit", getConfig);
    document.querySelector("#set-group-form").addEventListener("submit", setGroup);
    document.querySelector("#get-group-bonus-form").addEventListener("submit", getGroupBonus);
    document.querySelector("#get-token-price-form").addEventListener("submit", getTokenPrice);
    document.querySelector("#withdraw-token-form").addEventListener("submit", withdrawToken);
    
});
    

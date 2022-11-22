import {Component} from "react";
import '../styles/PopupItem.css';
import {Address, BOC, Builder} from "ton3-core";
import {TextEncoder} from "util";
import dTonAPI from "../api/dton";
import {TonhubConnector} from "ton-x";

const TextEncodingPolyfill = require('text-encoding');

const nft_url = "https://raw.githubusercontent.com/disintar/onetimenft/main/fake.json"

// do not ever use this nft code in production
const nftCodeBase64 = "te6ccgECDgEAAdoAAQ7_APgAiPsEAQEU_wD0pBP0vPLICwICAWIDBAICzAUGAAmhH5_gDwIBIAcIAB3YHkZZ-sZ4sA54tmZPaqQC2dGRDjgEkvgfBoaYGAuNhJL4HwfSB9IBj9ABi465D9ABj9ABh4A4JZxwoYNhEaKRljgvlwyoD9IGoYCBH4BHADaY_pn5FBCC_mHopdR0SZCBuvGSAJ7Z5wGBoaGpqAwQgX5ZNRXXGBL4JCB_l4QJCgIBWAwNAfZRNccF8uGR-kAh8Ab6QNIAMfoACoIIB6EgoSGUUxWgod4i1wsBwwAgkgahkTbiIML_8uGSIY4-ghAFE42RyFAJzxZQC88WcSRJFFRGoHCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAEEeUECo3W-ILAHJwghCLdxc1BcjL_1AEzxYQJIBAcIAQyMsFUAfPFlAF-gIVy2oSyx_LPyJus5RYzxcBkTLiAckB-wAAgAKONCbwBkYwghDVMnbbAW1xcIAQyMsFUAfPFlAF-gIVy2oSyx_LPyJus5RYzxcBkTLiAckB-wCTMDI04lUC8AgAET6RDDAAPLhTYAA7O1E0NM_-kAg10nCAJp_AfpA1DAQJBAj4DBwWW1tg";
const nftCode = BOC.fromStandard(Buffer.from(nftCodeBase64, 'base64'));

export default class DeployOrSend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: props.steps,
            wallet: props.wallet,
            walletAddress: props.walletAddress,
            currentStep: 0,

            // TonHub specific
            tonHubAppPublicKey: props.tonHubAppPublicKey,
            tonHubSessionSeed: props.tonHubSessionSeed,

            stepStatus: '',
            lastUpdated: '',
            error: '',
            loadedTime: Math.round((Date.now()) / 1000)

        }

        this.checkInterval = 0
        this.dton = new dTonAPI()
    }

    componentDidMount() {
        this.processStep()
    }

    processStep = () => {
        if (this.state.steps.at(this.state.currentStep) === "Mint NFT") {
            this.mintNewNft()
        }
    }

    mintNewNft = () => {
        const data = new Builder()

        data.storeUint(0, 64)
        data.storeUint(0, 2) // collection
        data.storeAddress(new Address(this.state.walletAddress))

        const nftContent = new Builder()
        nftContent.storeUint(1, 8)

        const textBytes = Buffer.from("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rpc2ludGFyL29uZXRpbWVuZnQvbWFpbi9mYWtlLmpzb24=", 'base64')
        nftContent.storeBytes(textBytes)
        data.storeRef(nftContent.cell())

        // this will allow unique address for NFT
        data.storeUint(this.state.loadedTime, 32)

        const stateInit = new Builder();

        // split_depth - 0
        // special - 0
        // code cell ref - 1
        // data cell ref - 1
        // lib - no
        stateInit.storeBits([0, 0, 1, 1, 0]);
        stateInit.storeRef(nftCode);
        stateInit.storeRef(data.cell());
        const stateInitBOC = BOC.toBytesStandard(stateInit.cell());
        const stateInitBase64 = Buffer.from(stateInitBOC).toString('base64')
        const stateInitCalculatedAddress = "0:" + stateInit.cell().hash().toString().toUpperCase()
        const friendlyNftAddress = (new Address(stateInitCalculatedAddress, {bounceable: true})).toString({})
        const amount = (0.01) * 10 ** 9;

        let notifyString;

        if (this.state.wallet === 'TonHub') {
            const request = {
                seed: this.state.tonHubSessionSeed, // Session Seed
                appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                to: friendlyNftAddress, // Destination
                value: amount, // Amount in nano-tons
                timeout: 5 * 60 * 1000, // 5 minute timeout
                stateInit: stateInitBase64, // Optional serialized to base64 string state_init cell
            };
            const connector = new TonhubConnector({network: "mainnet"});
            connector.requestTransaction(request).then(response => {
                console.log(response);
                if (response.type !== 'success') {
                    this.setState({error: 'Problems with your tonhub session. Please try to relogin'})
                }
            })

            notifyString = "Please, accept transaction in app";
        } else if (this.state.wallet === 'TON Extension') {
            const provider = window.ton;

            provider.send(
                'ton_sendTransaction',
                [{
                    to: friendlyNftAddress,
                    value: amount.toString(),
                    stateInit: stateInitBase64
                }]
            ).then(x => console.log(x));

            notifyString = 'Please, accept transaction in extension'
        }

        const baseInfo = <>
            <div className={"PopupStepProcessItem"}>
                <p className={"PopupStepProcessItemLeft"}>Calculated NFT address:</p>
                <p className={"PopupStepProcessItemRight"}>{friendlyNftAddress}</p>
            </div>

            <div className={"PopupStepProcessItem"}>
                <p className={"PopupStepProcessItemLeft"}>Status:</p>
                <p className={"PopupStepProcessItemRight"}>{notifyString}</p>
            </div>
        </>

        this.setState({
            stepStatus: <>
                {baseInfo}

                <div key="trnscnt" className={"PopupStepProcessItem"}>
                    <p className={"PopupStepProcessItemLeft"}>Transactions on expected address:</p>
                    <p className={"PopupStepProcessItemRight"}>...</p>
                </div>
            </>,
            lastUpdated: (new Date()).toString()
        })


        this.checkInterval = setInterval(() => {
            this.dton.getTransactionCount(friendlyNftAddress).then(data => {
                this.setState({
                    stepStatus: <>
                        {baseInfo}

                        <div key="trnscnt" className={"PopupStepProcessItem"}>
                            <p className={"PopupStepProcessItemLeft"}>Transactions on expected address:</p>
                            <p className={"PopupStepProcessItemRight"}>{data.data.accountTransactionCount}</p>
                        </div>
                    </>,
                    lastUpdated: (new Date()).toString()
                }, data.data.accountTransactionCount > 0 ? () => {
                    this.stopCheck()

                    setTimeout(() => {
                        this.setState({
                            currentStep: this.state.currentStep + 1,
                            stepStatus: <></>
                        });

                        this.processStep();
                    }, 1000)

                } : null)
            })
        }, 1000)

    }

    componentWillUnmount() {
        clearInterval(this.checkInterval)
    }

    stopCheck = () => {
        clearInterval(this.checkInterval)
    }

    render() {
        return <div className={"PopupStepProcess"}>
            <h2>Step {this.state.currentStep} / {this.state.steps.length}</h2>
            <p>Please, don't refresh page</p>
            <div>
                <div className={"PopupStepProcessItem"}>
                    <p className={"PopupStepProcessItemLeft"}>Step description:</p>
                    <p className={"PopupStepProcessItemRight"}>{this.state.steps.at(this.state.currentStep)}</p>
                </div>

                <div className={"PopupStepProcessItem"}>
                    <p className={"PopupStepProcessItemLeft"}>Wallet:</p>
                    <p className={"PopupStepProcessItemRight"}>{this.state.wallet}</p>
                </div>

                <div className={"PopupStepProcessItem"}>
                    <p className={"PopupStepProcessItemLeft"}>Expected wallet address:</p>
                    <p className={"PopupStepProcessItemRight"}>{this.state.walletAddress}</p>
                </div>

                {this.state.stepStatus}

                <div className={"PopupStepProcessItem"}>
                    <p className={"PopupStepProcessItemLeft"}>Last updated:</p>
                    <p className={"PopupStepProcessItemRight"}>{this.state.lastUpdated}</p>
                </div>
            </div>


            <p>{this.state.error}</p>
        </div>
    }
}
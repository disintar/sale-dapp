import {Component} from "react";
import '../styles/PopupItem.css';
import {Address, BOC, Builder, Coins} from "ton3-core";
import dTonAPI from "../api/dton";
import {TonhubConnector} from "ton-x";

// do not ever use this nft code in production
const nftCodeBase64 = "te6ccgECDgEAAdoAAQ7_APgAiPsEAQEU_wD0pBP0vPLICwICAWIDBAICzAUGAAmhH5_gDwIBIAcIAB3YHkZZ-sZ4sA54tmZPaqQC2dGRDjgEkvgfBoaYGAuNhJL4HwfSB9IBj9ABi465D9ABj9ABh4A4JZxwoYNhEaKRljgvlwyoD9IGoYCBH4BHADaY_pn5FBCC_mHopdR0SZCBuvGSAJ7Z5wGBoaGpqAwQgX5ZNRXXGBL4JCB_l4QJCgIBWAwNAfZRNccF8uGR-kAh8Ab6QNIAMfoACoIImJaAoSGUUxWgod4i1wsBwwAgkgahkTbiIML_8uGSIY4-ghAFE42RyFAJzxZQC88WcSRJFFRGoHCAEMjLBVAHzxZQBfoCFctqEssfyz8ibrOUWM8XAZEy4gHJAfsAEEeUECo3W-ILAHJwghCLdxc1BcjL_1AEzxYQJIBAcIAQyMsFUAfPFlAF-gIVy2oSyx_LPyJus5RYzxcBkTLiAckB-wAAgAKONCbwBkYwghDVMnbbAW1xcIAQyMsFUAfPFlAF-gIVy2oSyx_LPyJus5RYzxcBkTLiAckB-wCTMDI04lUC8AgAET6RDDAAPLhTYAA7O1E0NM_-kAg10nCAJp_AfpA1DAQJBAj4DBwWW1tg";
const nftCode = BOC.fromStandard(Buffer.from(nftCodeBase64, 'base64'));


const jettonWalletCodeBase64 = "te6ccgECEQEAAxQAART_APSkE_S88sgLAQIBYgIDAgLLBAUAG6D2BdqJofQB9IH0gahhAgEgBgcAgdIAg1yHtRND6APpA-kDUMATTHyGCEBeNRRm6AoIQe92X3roSsfLixdM_MfoAMBOgUCPIUAT6AljPFgHPFszJ7VSAgEgCAkCAVgKCwC30QY4BJL4JwAOhpgYC42EqJr4H4CHB9IH0gGP0AGLjrkP0AGP0AGAFpj5DBCAfFP1LdSpiaLPgG8BDBCAvGoozdSxiiIgH4B3AawQgsr4PeXUms-AfwL4JCB_l4QAEWvpEMMAA8uFNgHxUD0z_6APpAIfAG7UTQ-gD6QPpA1DBRNqFSKscF8uLBKML_8uLCVDRCcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMkg-QBwdMjLAsoHy__J0AT6QPQEMfoAINdJwgDy4sR3gBjIywVQCM8WcPoCF8trE8yAwCASANDgCaghAXjUUZyMsfGcs_UAf6AiLPFlAGzxYl-gJQA88WyVAFzCORcpFx4lAIqBOggXUwoBS88uLFBMmAQPsAECPIUAT6AljPFgHPFszJ7VQC9TtRND6APpA-kDUMAjTP_oAUVGgBfpA-kBTW8cFVHNtcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL_8nQUA3HBRyx8uLDCvoAUaihgScQZrYIoYEnEKAYoSeXEEkQODdfBOMNJdcLAcMAI4A8QANM7UTQ-gD6QPpA1DAH0z_6APpAMFFRoVJJxwXy4sEnwv_y4sIFgU4goBa88uLDghB73ZfeyMsfFcs_UAP6AiLPFgHPFslxgBjIywUkzxZw-gLLaszJgED7AEATyFAE-gJYzxYBzxbMye1UgAHBSeaAYoYIQc2LQnMjLH1Iwyz9Y-gJQB88WUAfPFslxgBDIywUkzxZQBvoCFctqFMzJcfsAECQQIwB2wgCwjiGCENUydttwgBDIywVQCM8WUAT6AhbLahLLHxLLP8ly-wCTNWwh4gPIUAT6AljPFgHPFszJ7VQ=";
const jettonWalletCode = BOC.fromStandard(Buffer.from(jettonWalletCodeBase64, 'base64'));
const jettonCodeBase64 = "te6ccgECCwEAAeoAART_APSkE_S88sgLAQIBYgIDAgLMBAUCA3pgCQoD6dmRDjgEit8GhpgYC42Eit8H0gGADpj-mf9qJofQB9IGpqGBNgCscYGpqoquOC-XAkgP0gfQBqGBBoQDBrkP0AGBKIGigheAbQKpBkKAJ9ASxni2ZmZPaqcBNBCD3uy-9dcYEakuAB8YEYAmACcYEvgsIH-XhAYHCACTu_BQiAbgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkkHyAODpkZYFlA-X_5Og7wAxkZYKsZ4soAn0BCeW1iWZmZLj9gEA_jYD-gD6QPgoVBIIcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL_8nQUAjHBfLgShKhA1AkyFAE-gJYzxbMzMntVAH6QDAg1wsBwwCOH4IQ1TJ223CAEMjLBVADzxYi-gISy2rLH8s_yYBC-wCRW-IAMDUVxwXy4En6QDBZyFAE-gJYzxbMzMntVAAuUUPHBfLgSdQwAchQBPoCWM8WzMzJ7VQAfa289qJofQB9IGpqGDYY_BQAuCoQCaoKAeQoAn0BLGeLAOeLZmSRZGWAiXoAegBlgGT8gDg6ZGWBZQPl_-ToQAAfrxb2omh9AH0gamoYP6qQQA==";
const jettonCode = BOC.fromStandard(Buffer.from(jettonCodeBase64, 'base64'));

export default class DeployOrSend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: props.steps,
            wallet: props.wallet,
            walletAddress: props.walletAddress,
            currentStep: 0,

            nftPrice: props.nftPrice,

            // TonHub specific
            tonHubAppPublicKey: props.tonHubAppPublicKey,
            tonHubSessionSeed: props.tonHubSessionSeed,

            stepStatus: '',
            lastUpdated: '',
            error: '',
            loadedTime: Math.round((Date.now()) / 1000),
            stepInited: false,

            nftAddress: '',
            jettonAddress: '',
            contractCode: '',

            contractState: props.contractState,
            contractAddress: ''

        }

        this.checkInterval = 0
        this.dton = new dTonAPI()
    }

    componentDidMount() {
        fetch(`${window.location.origin}${window.location.pathname}` + "/nft_sale.json").then(x => x.json()).then(x => {
            this.setState({contractCode: x.code}, this.processStep);
        })
    }

    processStep = () => {
        if (!this.state.stepInited) {
            console.log("Current step: ", this.state.steps.at(this.state.currentStep))

            if (this.state.steps.at(this.state.currentStep) === "Mint NFT") {
                this.mintNewNft()
            } else if (this.state.steps.at(this.state.currentStep) === "Mint Jetton") {
                this.mintNewJetton()
            } else if (this.state.steps.at(this.state.currentStep) === "Mint contract") {
                this.mintContract()
            } else if (this.state.steps.at(this.state.currentStep) === "Transfer NFT") {
                this.sendNFT()
            }

            this.state.stepInited = true;
        }

    }

    buildCell = () => {
        try {
            const cell = new Builder()
            // sell mode
            cell.storeUint(this.state.contractState.initMode, 8)
            console.log("Start build cell with mode: ", this.state.contractState.initMode)

            // NFT address we want to sell
            if (this.state.nftAddress !== '') {
                console.log("Store minted nft address", this.state.nftAddress)
                cell.storeAddress(new Address(this.state.nftAddress))
            } else if (this.state.contractState.nftAddress !== '') {
                console.log("Store real nft address", this.state.contractState.nftAddress)
                cell.storeAddress(new Address(this.state.contractState.nftAddress))
            } else {
                console.log("Store null nft address")
                cell.storeUint(0, 2)
            }

            // NFT owner
            if (this.state.contractState.ownerAddress !== '') {
                console.log("Store owner", this.state.contractState.ownerAddress)
                cell.storeAddress(new Address(this.state.contractState.ownerAddress))
            } else {
                console.log("Store null owner")
                cell.storeUint(0, 2)
            }

            // NFT buyer
            if (this.state.contractState.buyerAddress !== '') {
                console.log("Store buyer", this.state.contractState.buyerAddress)
                cell.storeAddress(new Address(this.state.contractState.buyerAddress))
            } else {
                console.log("Store null buyer")
                cell.storeUint(0, 2)
            }

            // if uninited - save time for unique address
            if (this.state.contractState.initMode === 0) {
                console.log("Store random salt", Math.round(this.state.contractState.loadTime / 1000))
                cell.storeUint(Math.round(this.state.contractState.loadTime / 1000), 32)
            }

            const sellConfig = new Builder()

            sellConfig.storeUint(this.state.contractState.marketplaceFeeNumerator, 16)
            sellConfig.storeUint(this.state.contractState.marketplaceFeeDenominator, 16)
            console.log("Store marketplace fee", this.state.contractState.marketplaceFeeNumerator, this.state.contractState.marketplaceFeeDenominator)

            sellConfig.storeUint(this.state.contractState.royaltyFeeNumerator, 16)
            sellConfig.storeUint(this.state.contractState.royaltyFeeDenominator, 16)
            console.log("Store royalty fee", this.state.contractState.royaltyFeeNumerator, this.state.contractState.royaltyFeeDenominator)

            if (this.state.contractState.royaltyAddress !== '') {
                console.log("Store royalty destination", this.state.contractState.royaltyAddress)
                sellConfig.storeAddress(new Address(this.state.contractState.royaltyAddress))
            } else {
                console.log("Store null royalty destination")
                sellConfig.storeUint(0, 2)
            }

            cell.storeRef(sellConfig.cell())

            const priceConfig = new Builder()

            console.log("Store isTon ", this.state.contractState.isTon)
            priceConfig.storeUint(this.state.contractState.isTon ? 1 : 0, 1)

            console.log("Store price ", this.state.contractState.price)
            priceConfig.storeCoins(new Coins(this.state.contractState.price))

            if (this.state.contractState.limitAddress !== '') {
                console.log("Store limit address", this.state.contractState.limitAddress)
                priceConfig.storeAddress(new Address(this.state.contractState.limitAddress))
            } else {
                console.log("Store null limit address")
                priceConfig.storeUint(0, 2)
            }

            console.log("Store limited time", Math.round(this.state.contractState.limitedTime / 1000))
            priceConfig.storeUint(Math.round(this.state.contractState.limitedTime / 1000), 32)

            // we always store address for jetton wallet of this smart contract as addr_none
            // to make address of smart contract predictable
            // we will provide real address of jetton wallet on deploy or configuration
            priceConfig.storeUint(0, 2)

            if (this.state.contractState.jettonCollectionMintNew && this.state.jettonAddress && this.state.jettonAddress !== "") {
                console.log("save minted jetton address", this.state.jettonAddress)
                priceConfig.storeAddress(new Address(this.state.jettonAddress))
            } else if (this.state.contractState.jettonCollectionAddress !== "") {
                console.log("save jetton address", this.state.contractState.jettonCollectionAddress)
                priceConfig.storeAddress(new Address(this.state.contractState.jettonCollectionAddress))
            } else {
                console.log("save null jetton address")
                priceConfig.storeUint(0, 2) // not jetton sale
            }

            cell.storeRef(priceConfig.cell())
            console.log("Data cell created: ", cell.cell().hash())
            return cell.cell()
        } catch (e) {
            console.log(e)
            return (new Builder()).cell()
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
            );

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
            lastUpdated: (new Date()).toString(),
            nftAddress: friendlyNftAddress
        }, () => {

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
                        this.stopCheck(() => {
                            this.setState({
                                currentStep: this.state.currentStep + 1,
                                stepStatus: <></>,
                                stepInited: false
                            }, () => {
                                this.processStep()
                            });
                        })
                    } : null)
                })
            }, 2000)
        })
    }

    mintNewJetton = () => {
        const data = new Builder()
        data.storeCoins(new Coins(this.state.nftPrice * 100))
        data.storeAddress(new Address(this.state.walletAddress))

        const jettonMetaContent = new Builder()
        jettonMetaContent.storeUint(1, 8)

        const textBytes = Buffer.from("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Rpc2ludGFyL29uZXRpbWVuZnQvbWFpbi9mYWtlX2pldHRvbi5qc29u", 'base64')
        jettonMetaContent.storeBytes(textBytes)

        data.storeRef(jettonMetaContent.cell())
        data.storeRef(jettonWalletCode)

        // this will allow unique address for jetton
        data.storeUint(this.state.loadedTime, 32)


        const mintMaterMessage = new Builder();
        mintMaterMessage.storeUint(395134233, 32) // op internal_transfer
        mintMaterMessage.storeUint(0, 64) // query id
        mintMaterMessage.storeCoins(new Coins(this.state.nftPrice * 10)) // mint amount
        mintMaterMessage.storeAddress(new Address(this.state.walletAddress))
        mintMaterMessage.storeUint(0, 2)
        mintMaterMessage.storeCoins(new Coins(0))
        mintMaterMessage.storeUint(0, 1)

        const mintMessage = new Builder();
        mintMessage.storeUint(21, 32)
        mintMessage.storeUint(0, 64)
        mintMessage.storeAddress(new Address(this.state.walletAddress))
        mintMessage.storeCoins(new Coins(0.007))
        mintMessage.storeRef(mintMaterMessage.cell())
        const payloadBOC = BOC.toBytesStandard(mintMessage.cell());
        const payloadBase64 = Buffer.from(payloadBOC).toString('base64')

        const stateInit = new Builder();

        // split_depth - 0
        // special - 0
        // code cell ref - 1
        // data cell ref - 1
        // lib - no
        stateInit.storeBits([0, 0, 1, 1, 0]);
        stateInit.storeRef(jettonCode);
        stateInit.storeRef(data.cell());
        const stateInitBOC = BOC.toBytesStandard(stateInit.cell());
        const stateInitBase64 = Buffer.from(stateInitBOC).toString('base64')
        const stateInitCalculatedAddress = "0:" + stateInit.cell().hash().toString().toUpperCase()
        const friendlyJettonAddress = (new Address(stateInitCalculatedAddress, {bounceable: true})).toString({})
        const amount = (0.03) * 10 ** 9;

        let notifyString;

        if (this.state.wallet === 'TonHub') {
            const request = {
                seed: this.state.tonHubSessionSeed, // Session Seed
                appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                to: friendlyJettonAddress, // Destination
                value: amount, // Amount in nano-tons
                timeout: 5 * 60 * 1000, // 5 minute timeout
                stateInit: stateInitBase64, // Optional serialized to base64 string state_init cell
                payload: payloadBase64
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
                    to: friendlyJettonAddress,
                    value: amount.toString(),
                    stateInit: stateInitBase64,
                    data: payloadBase64,
                    dataType: "boc"
                }]
            );

            notifyString = 'Please, accept transaction in extension'
        }

        const baseInfo = <>
            <div className={"PopupStepProcessItem"}>
                <p className={"PopupStepProcessItemLeft"}>Calculated Jetton address:</p>
                <p className={"PopupStepProcessItemRight"}>{friendlyJettonAddress}</p>
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
            lastUpdated: (new Date()).toString(),
            jettonAddress: friendlyJettonAddress
        }, () => {
            this.checkInterval = setInterval(() => {
                this.dton.getTransactionCount(friendlyJettonAddress).then(data => {
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
                        this.stopCheck(() => {
                            this.setState({
                                currentStep: this.state.currentStep + 1,
                                stepStatus: <></>,
                                stepInited: false
                            }, () => {
                                this.processStep()
                            });
                        })
                    } : null)
                })
            }, 2000)
        })
    }

    mintContract = () => {
        const data = this.buildCell()

        const stateInit = new Builder()

        // split_depth - 0
        // special - 0
        // code cell ref - 1
        // data cell ref - 1
        // lib - no
        stateInit.storeBits([0, 0, 1, 1, 0])

        const contractCode = BOC.fromStandard(Buffer.from(this.state.contractCode, 'base64'));
        stateInit.storeRef(contractCode)
        stateInit.storeRef(data)

        const stateInitBOC = BOC.toBytesStandard(stateInit.cell())
        const stateInitBase64 = Buffer.from(stateInitBOC).toString('base64')
        const stateInitCalculatedAddress = "0:" + stateInit.cell().hash().toString().toUpperCase()
        const friendlyAddress = (new Address(stateInitCalculatedAddress, {bounceable: true})).toString({})


        let jettonAddress = "";

        if (this.state.jettonAddress !== "") {
            jettonAddress = this.state.jettonAddress;
        } else if (this.state.contractState.jettonCollectionAddress !== "") {
            jettonAddress = this.state.contractState.jettonCollectionAddress;
        }

        // need to add payload with jetton address
        if (!this.state.contractState.isTon) {
            console.log("Deploy with jetton payload");
            const amount = (0.02) * 10 ** 9;

            this.dton.calculateJettonAddress(jettonAddress, friendlyAddress).then(dtonAnswer => {
                const jettonContractAddress = dtonAnswer.data.getJettonWalletAddress

                const mintMessage = new Builder()
                mintMessage.storeAddress(new Address(jettonContractAddress))

                const payloadBOC = BOC.toBytesStandard(mintMessage.cell())
                const payloadBase64 = Buffer.from(payloadBOC).toString('base64')

                let notifyString;

                if (this.state.wallet === 'TonHub') {
                    const request = {
                        seed: this.state.tonHubSessionSeed, // Session Seed
                        appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                        to: friendlyAddress, // Destination
                        value: amount, // Amount in nano-tons
                        timeout: 5 * 60 * 1000, // 5 minute timeout
                        stateInit: stateInitBase64, // Optional serialized to base64 string state_init cell
                        payload: payloadBase64
                    };
                    const connector = new TonhubConnector({network: "mainnet"});
                    connector.requestTransaction(request).then(response => {
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
                            to: friendlyAddress,
                            value: amount.toString(),
                            stateInit: stateInitBase64,
                            data: payloadBase64,
                            dataType: "boc"
                        }]
                    );

                    notifyString = 'Please, accept transaction in extension'
                }

                const baseInfo = <>
                    <div className={"PopupStepProcessItem"}>
                        <p className={"PopupStepProcessItemLeft"}>Calculated contract address:</p>
                        <p className={"PopupStepProcessItemRight"}>{friendlyAddress}</p>
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
                    lastUpdated: (new Date()).toString(),
                    contractAddress: friendlyAddress
                }, () => {
                    this.checkInterval = setInterval(() => {
                        this.dton.getTransactionCount(friendlyAddress).then(data => {
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
                                this.stopCheck(() => {
                                    this.setState({
                                        currentStep: this.state.currentStep + 1,
                                        stepStatus: <></>,
                                        stepInited: false
                                    }, () => {
                                        this.processStep()
                                    });
                                })
                            } : null)
                        })
                    }, 2000)
                })
            })
        } else { // just deploy contract with empty state
            console.log("Deploy with no payload")
            const amount = (0.01) * 10 ** 9;

            let notifyString;

            if (this.state.wallet === 'TonHub') {
                const request = {
                    seed: this.state.tonHubSessionSeed, // Session Seed
                    appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                    to: friendlyAddress, // Destination
                    value: amount, // Amount in nano-tons
                    timeout: 5 * 60 * 1000, // 5 minute timeout
                    stateInit: stateInitBase64, // Optional serialized to base64 string state_init cell
                };
                const connector = new TonhubConnector({network: "mainnet"});
                connector.requestTransaction(request).then(response => {
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
                        to: friendlyAddress,
                        value: amount.toString(),
                        stateInit: stateInitBase64,
                    }]
                );

                notifyString = 'Please, accept transaction in extension'
            }

            const baseInfo = <>
                <div className={"PopupStepProcessItem"}>
                    <p className={"PopupStepProcessItemLeft"}>Calculated contract address:</p>
                    <p className={"PopupStepProcessItemRight"}>{friendlyAddress}</p>
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
                lastUpdated: (new Date()).toString(),
                contractAddress: friendlyAddress
            }, () => {
                this.checkInterval = setInterval(() => {
                    this.dton.getTransactionCount(friendlyAddress).then(data => {
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
                            this.stopCheck(() => {
                                this.setState({
                                    currentStep: this.state.currentStep + 1,
                                    stepStatus: <></>,
                                    stepInited: false,
                                    contractAddress: friendlyAddress
                                }, () => {
                                    this.processStep()
                                });
                            })
                        } : null)
                    })
                }, 2000)
            })
        }

    }

    sendNFT = () => {
        const message = new Builder();
        message.storeUint(0x5fcc3d14, 32)
        message.storeUint(228, 64) // query id
        message.storeAddress(new Address(this.state.contractAddress))
        message.storeAddress(new Address(this.state.walletAddress))
        message.storeUint(0, 1) // custom payload
        message.storeCoins(new Coins(0.01)) // forward amount
        message.storeUint(0, 32)

        let nft_address;
        // NFT address we want to sell
        if (this.state.nftAddress !== '') {
            nft_address = this.state.nftAddress;
        } else if (this.state.contractState.nftAddress !== '') {
            nft_address = this.state.contractState.nftAddress;
        } else {
            this.setState({
                currentStep: this.state.currentStep + 1,
                stepStatus: <></>,
                stepInited: false
            }, () => {
                window.location = `/?mode=app&stage=existing&address=${this.state.contractAddress}`
            });
        }

        const payloadBOC = BOC.toBytesStandard(message.cell())
        const payloadBase64 = Buffer.from(payloadBOC).toString('base64')

        let notifyString;
        const amount = 0.05 * 10 ** 9

        if (this.state.wallet === 'TonHub') {
            const request = {
                seed: this.state.tonHubSessionSeed, // Session Seed
                appPublicKey: this.state.tonHubAppPublicKey, // Wallet's app public key
                to: nft_address, // Destination
                value: amount, // Amount in nano-tons
                timeout: 5 * 60 * 1000, // 5 minute timeout
                payload: payloadBase64
            };
            const connector = new TonhubConnector({network: "mainnet"});
            connector.requestTransaction(request).then(response => {
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
                    to: nft_address,
                    value: amount.toString(),
                    data: payloadBase64,
                    dataType: "boc"
                }]
            );

            notifyString = 'Please, accept transaction in extension'
        }

        const baseInfo = <>
            <div className={"PopupStepProcessItem"}>
                <p className={"PopupStepProcessItemLeft"}>NFT address:</p>
                <p className={"PopupStepProcessItemRight"}>{nft_address}</p>
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
                    <p className={"PopupStepProcessItemLeft"}>Owner of NFT:</p>
                    <p className={"PopupStepProcessItemRight"}>...</p>
                </div>
            </>,
            lastUpdated: (new Date()).toString()
        }, () => {

            const needed_owner = new Address(this.state.contractAddress).toString('base64', {bounceable: true});

            this.checkInterval = setInterval(() => {
                this.dton.getNftOwner(nft_address).then(data => {
                    const transaction = data.data.transactions[0];
                    const address = new Address(transaction.parsed_nft_owner_address_workchain + ":" + transaction.parsed_nft_owner_address_address).toString('base64', {bounceable: true})

                    this.setState({
                        stepStatus: <>
                            {baseInfo}

                            <div key="trnscnt" className={"PopupStepProcessItem"}>
                                <p className={"PopupStepProcessItemLeft"}>Owner of NFT:</p>
                                <p className={"PopupStepProcessItemRight"}>{address}</p>
                            </div>
                        </>,
                        lastUpdated: (new Date()).toString()
                    }, address === needed_owner ? () => {
                        this.stopCheck(() => {
                            window.location = `/?mode=app&stage=existing&address=${this.state.contractAddress}`
                        })
                    } : null)
                })
            }, 2000)
        })
    }

    componentWillUnmount() {
        clearInterval(this.checkInterval)
    }

    stopCheck = (f) => {
        clearInterval(this.checkInterval)
        setTimeout(f, 1000);
    }

    render() {
        return <div className={"PopupStepProcess"}>
            <h2>Step {this.state.currentStep + 1} / {this.state.steps.length}</h2>
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

                <br/>
                <br/>
                <a style={{cursor: "pointer"}} onClick={() => this.setState({stepInited: false}, this.processStep)}>One
                    more time</a>
            </div>


            <p>{this.state.error}</p>
        </div>
    }
}
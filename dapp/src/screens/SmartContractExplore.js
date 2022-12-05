import React, {Component} from 'react'
import '../styles/SmartContractExplore.css';
import dTonAPI from "../api/dton";
import {BOC} from "ton3-core";
import {ton_icon} from "../icons";

const parseAddressFromCs = bocBase64 => {
    const cell = BOC.fromStandard(Buffer.from(bocBase64, 'base64'))
    return cell.slice().loadAddress()
}

const fixBigAddress = (addr, cnt = 14) => {
    if (!addr || !addr.length) {
        return "addr_none"
    }

    if (addr.length > cnt) {
        const toCut = addr.length - cnt - 5
        const first_part = addr.substr(0, cnt / 2)
        const second_part = addr.substr(cnt / 2 + 4 + toCut, addr.length)

        if (cnt > 10) {
            return `${first_part}... ${second_part}`
        } else {
            return `${first_part} . ${second_part}`
        }

    } else {
        return addr
    }
}

const fixContractMode = (mode) => {
    if (mode === "0") {
        return "Uninited"
    } else if (mode === "1") {
        return "Inited"
    } else if (mode === "2") {
        return "Bought"
    } else if (mode === "3") {
        return "Canceled"
    }
}

export default class SmartContractExplore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            address: props.address,
            loaded: false
        }

        this.dton = new dTonAPI()

        this.updateContractInfo()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.address !== this.state.address) {
            this.updateContractInfo()
        }
    }

    updateContractInfo = () => {
        this.dton.getContractInfo(this.state.address).then(data => {
            this.setState({
                loaded: true,
                transactionsCount: data.data.accountTransactionCount,
                codeVerified: data.data.transactions[0].account_state_state_init_code === this.props.code.code,
                grams: data.data.transactions[0].account_storage_balance_grams,
            })
        })

        this.dton.runGetMethod(this.state.address, "get_sale_data", []).then(data => {
            if (data.data.run_method.stack.length > 9) {
                try {
                    const marketplaceCs = parseAddressFromCs(data.data.run_method.stack[0].value)
                    const nftCs = parseAddressFromCs(data.data.run_method.stack[1].value)
                    const ownerAddr = parseAddressFromCs(data.data.run_method.stack[2].value)
                    const fullPrice = data.data.run_method.stack[3].value
                    const market_fee = data.data.run_method.stack[4].value
                    const royaltyCs = parseAddressFromCs(data.data.run_method.stack[5].value)
                    const royalty = data.data.run_method.stack[6].value
                    const isTon = data.data.run_method.stack[7].value
                    const my_jettonCs = parseAddressFromCs(data.data.run_method.stack[8].value)
                    const limitCs = parseAddressFromCs(data.data.run_method.stack[9].value)
                    const end_at = data.data.run_method.stack[10].value


                    this.setState({
                        marketplace_address: marketplaceCs ? marketplaceCs.toString() : null,
                        nft_address: nftCs ? nftCs.toString() : null,
                        owner_address: ownerAddr ? ownerAddr.toString() : null,
                        full_price: fullPrice,
                        market_fee: market_fee,
                        royalty_address: royaltyCs ? royaltyCs.toString() : null,
                        royalty: royalty,
                        is_ton: isTon,
                        my_jetton_address: my_jettonCs ? my_jettonCs.toString() : null,
                        limit_address: limitCs ? limitCs.toString() : null,
                        end_at: end_at
                    })
                } catch (e) {
                    console.error(e)
                }
            }
        })

        this.dton.runGetMethod(this.state.address, "get_version", []).then(data => {
            this.setState({
                version: data.data.run_method.stack[0].value
            })
        })

        this.dton.runGetMethod(this.state.address, "get_is_closed", []).then(data => {
            this.setState({
                is_closed: data.data.run_method.stack[0].value
            })
        })

        this.dton.runGetMethod(this.state.address, "get_sell_info", []).then(data => {
            this.setState({
                mode: data.data.run_method.stack[0].value
            })
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.address !== state.address) {
            return {
                address: props.address
            };
        }

        return null;
    }

    render() {
        return (
            <div>
                <div className="SmartContractExploreHeader">
                    <h2>Sale contract</h2>
                    <h3>{this.state.address}</h3>
                </div>

                {this.state.loaded ? <>
                    <div className="SmartContractExploreHeaderInfo">
                        <div className="SmartContractExploreHeaderInfoBlock">
                            <p>Toncli code:</p>
                            <p>{this.state.codeVerified ? 'verified ✅' : 'not-verified ❌'}</p>
                        </div>

                        <div className="SmartContractExploreHeaderInfoBlock">
                            <p>Transactions count:</p>
                            <p>{this.state.transactionsCount}</p>
                        </div>

                        <div className="SmartContractExploreHeaderInfoBlock">
                            <p>Grams:</p>
                            <p>{this.state.grams}</p>
                        </div>
                    </div>

                    <div>
                        <div className="SmartContractExploreSmcInfo">
                            <h3>Contract state</h3>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Version:</p>
                                <p>{this.state.version}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Contract mode:</p>
                                <p>{fixContractMode(this.state.mode)}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Is closed:</p>
                                <p>{this.state.is_closed}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Marketplace:</p>
                                <a href={`https://dton.io/a/${this.state.marketplace_address}`}>{fixBigAddress(this.state.marketplace_address)}</a>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>NFT Address:</p>
                                <a href={`https://dton.io/a/${this.state.nft_address}`}>{fixBigAddress(this.state.nft_address)}</a>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Owner Address:</p>
                                <a href={`https://dton.io/a/${this.state.owner_address}`}>{fixBigAddress(this.state.owner_address)}</a>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlockWithIcon">
                                <p>Price:</p>
                                <p>{this.state.full_price / 10 ** 9} {ton_icon}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlockWithIcon">
                                <p>Marketplace fee:</p>
                                <p>{this.state.market_fee / 10 ** 9} {ton_icon}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Royalty Address:</p>
                                <a href={`https://dton.io/a/${this.state.royalty_address}`}>{fixBigAddress(this.state.royalty_address)}</a>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlockWithIcon">
                                <p>Royalty:</p>
                                <p>{this.state.royalty / 10 ** 9} {ton_icon}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Sale:</p>
                                <p>{this.state.is_ton ? ton_icon : "Jetton"}</p>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Sale Jetton Wallet Address:</p>
                                <a href={`https://dton.io/a/${this.state.my_jetton_address}`}>{fixBigAddress(this.state.my_jetton_address)}</a>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Limit sale address for:</p>
                                <a href={`https://dton.io/a/${this.state.limit_address}`}>{fixBigAddress(this.state.limit_address)}</a>
                            </div>

                            <div className="SmartContractExploreSmcInfoBlock">
                                <p>Limit time:</p>
                                <p>{this.state.end_at !== "0" ? this.state.end_at : "Not limited"}</p>
                            </div>
                        </div>
                    </div>
                </> : <div>
                    <p>Loading...</p>
                </div>}

            </div>
        );
    }
}
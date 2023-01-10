import React, {Component} from 'react'
import './styles/App.css'
import {dec2hex} from './utils/hex'
import AppMenu from "./AppMenu";

class ToncliAppDescription extends Component {
    render() {
        const compile_date = new Date(parseInt(this.props.code['date']) * 1000);


        return <div className="App-header"><p>Toncli build info</p>
            <div className="toncliInfo">
                <div className={"toncliRow"}>
                    <div>
                        Compile date:
                    </div>
                    <div>
                        {compile_date.toString()}
                    </div>
                </div>
            </div>


            <div className="toncliInfo">
                <div className={"toncliRow"}>
                    <div>
                        Func version:
                    </div>
                    <div>
                        {this.props.code['func-version']}
                    </div>
                </div>
            </div>

            <div className="toncliInfo">
                <div className={"toncliRow"}>
                    <div>
                        Fift version:
                    </div>
                    <div>
                        {this.props.code['fift-version']}
                    </div>
                </div>
            </div>


            <div className="toncliInfo">
                <div className={"toncliRow"}>
                    <div>
                        Code hash:
                    </div>
                    <div>
                        {dec2hex(this.props.code['code-hash'])}
                    </div>
                </div>
            </div>

            <div className="toncliInfo">
                <div className={"toncliRow"}>
                    <div>
                        Code:
                    </div>
                    <div className={"largeText"}>
                        {this.props.code.code}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);


        const params = new URLSearchParams(window.location.search);
        if (!params.get('stage')) {
            this.updateLocation('mode', 'app');
        }

        this.state = {
            code: {},
            mode: params.get('mode') ? params.get('mode') : null
        }
    }

    componentDidMount() {
        fetch(`${window.location.origin}${window.location.pathname}` + "/nft_sale.json").then(x => x.json()).then(x => {
            this.setState({code: x});
        })
    }

    updateLocation = (key, new_value) => {
        const params = new URLSearchParams(window.location.search);
        const all_keys = Array.from(params.keys());

        if (!params.get(key)) {
            all_keys.push(key)
        }

        const final_string = all_keys.reduce((accumulator, currentValue) => {
            let item;
            if (currentValue === key) {
                item = `${key}=${new_value}`
            } else {
                item = `${currentValue}=${params.get(currentValue)}`
            }

            if (accumulator === '?') {
                return `${accumulator}${item}`
            } else {
                return `${accumulator}&${item}`
            }
        }, '?')

        window.location = `${window.location.origin}${window.location.pathname}${final_string}`
    }

    render() {

        return <div className="App">
            <h1>TON dApp: NFT sale</h1>
            <ul className={"NastyMenu"}>
                <li className={this.state.mode === 'app' ? "active" : null}
                    onClick={() => this.updateLocation('mode', 'app')}>🎮 dApp
                </li>
                <li className={this.state.mode === 'description' ? "active" : null}
                    onClick={() => this.updateLocation('mode', 'description')}>🏗 Build info
                </li>
                <li className={this.state.mode === 'wtf' ? "active" : null}
                    onClick={() => this.updateLocation('mode', "wtf")}>🤯 What's is going on
                </li>
            </ul>

            {this.state.mode === 'description' ? <ToncliAppDescription code={this.state.code}/> : null}
            {this.state.mode === 'app' ? <AppMenu code={this.state.code}/> : null}

            <div style={{
                width: "900px",
                margin: "3rem auto 0 auto",
                borderTop: "3px solid #242424",
                color: "white",
                textAlign: "center",
                paddingBottom: "4rem"
            }}>
                <p>©2023 Disintar LLP / <a className={"github"} href={"https://github.com/disintar/sale-dapp"}>GitHub of this dApp</a></p>
            </div>
        </div>
    }
}
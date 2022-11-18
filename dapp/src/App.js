import React, {Component} from 'react'
import './App.css';


function dec2hex(str) {
    if (str) {
        let dec = str.split(''), sum = [], hex = [], i, s
        while (dec.length) {
            s = 1 * dec.shift()
            for (i = 0; s || i < sum.length; i++) {
                s += (sum[i] || 0) * 10
                sum[i] = s % 16
                s = (s - sum[i]) / 16
            }
        }
        while (sum.length) {
            hex.push(sum.pop().toString(16))
        }
        return hex.join('')
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {code: {}}
    }

    componentDidMount() {
        fetch(window.location.toString() + "/nft_sale.json").then(x => x.json()).then(x => {
            this.setState({code: x});
        })
    }

    render() {
        const compile_date = new Date(parseInt(this.state.code['date']) * 1000);

        return <div className="App">
            <header className="App-header">
                <p>Toncli build info for <b>{this.state.code["contract-name"]}</b></p>


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
                            {this.state.code['func-version']}
                        </div>
                    </div>
                </div>

                <div className="toncliInfo">
                    <div className={"toncliRow"}>
                        <div>
                            Fift version:
                        </div>
                        <div>
                            {this.state.code['fift-version']}
                        </div>
                    </div>
                </div>


                <div className="toncliInfo">
                    <div className={"toncliRow"}>
                        <div>
                            Code hash:
                        </div>
                        <div>
                            {dec2hex(this.state.code['code-hash'])}
                        </div>
                    </div>
                </div>

                <div className="toncliInfo">
                    <div className={"toncliRow"}>
                        <div>
                            Code:
                        </div>
                        <div className={"largeText"}>
                            {this.state.code.code}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    }
}
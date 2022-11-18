import React, {Component} from 'react'
import './App.css';


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
                            {parseInt(this.state.code['code-hash']).toString(16)}
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
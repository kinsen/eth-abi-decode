import React, { Component } from 'react';
import { Button, Input, Row, Col } from 'antd';
import ReactJson from 'react-json-view';
import InputDataDecoder from "ethereum-input-data-decoder";
import { ethers } from "ethers";
import logo from './logo.svg';
import './App.css';

const { TextArea } = Input;

const decodeInput = (abi, data) => {
    // https://github.com/miguelmota/ethereum-input-data-decoder
    const decoder = new InputDataDecoder([abi]);
    const result = decoder.decodeData(data);
    const resp = {};
    for (var i = 0; i < result.names.length; i++) {
        var data_type = result.types[i];
        var data = result.inputs[i];
        if (data_type == "address")
            data = "0x" + data;
        else if (data_type.endsWith("[]") && Array.isArray(data)) {
            for (var j = 0; j < data.length; j++) {
                data[j] = data[j].toString();
                if (data_type.startsWith("address"))
                    data[j] = "0x" + data[j];
            }
        }
        else
            data = data.toString();
        resp[`${result.names[i]}(${data_type})`] = data;
    }
    return resp;
}

const decodeOuput = (abi, data) => {
    // https://github.com/ethers-io/ethers.js/issues/211
    var iface = new ethers.utils.Interface([abi]);
    console.log(iface.functions[abi.name]);
    var result = iface.functions[abi.name].decode(data);
    const resp = {};
    for (var i = 0; i < abi.outputs.length; i++) {
        var data_name = abi.outputs[i].name || `param_${i}`;
        var data_type = abi.outputs[i].type;
        var data = result[i];
        if (data_type == "address")
            data = "0x" + data;
        else if (data_type.endsWith("[]") && Array.isArray(data)) {
            for (var j = 0; j < data.length; j++) {
                data[j] = data[j].toString();
                if (data_type.startsWith("address"))
                    data[j] = "0x" + data[j];
            }
        }
        else
            data = data.toString();

        resp[`${data_name}(${data_type})`] = data;
    }
    return resp;
}
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            result: {}
        };
        this.input = React.createRef();
        this._data = React.createRef();
    }

    abi = () => {
        return JSON.parse(this.input.current.resizableTextArea.props.value);
    }

    data = () => {
        return this._data.current.resizableTextArea.props.value;
    }

    onDecodeInputClick = () => {
        var result = decodeInput(this.abi(), this.data());
        this.setState({ result: result });
        console.log(result);
    }
    onDecodeOutputClick = () => {
        var result = decodeOuput(this.abi(), this.data());
        this.setState({ result: result });
        console.log(result);
    }

    render() {
        const { result } = this.state;
        return (<>
            <Row>
                <Col span={24}>
                    <Button onClick={this.onDecodeInputClick}>Decode Input</Button>
                    <Button onClick={this.onDecodeOutputClick}>Decode Output</Button>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={8}>
                    <div>ABI</div>
                    <TextArea rows={30} cols={60} ref={this.input} />
                </Col>
                <Col span={8}>
                    <div>Data</div>
                    <TextArea rows={30} cols={60} placeholder="0x..." ref={this._data} />
                </Col>
                <Col span={8}>
                    <div>Result</div>
                    <ReactJson theme="apathy" iconStyle="triangle" displayDataTypes={false} src={result} />
                </Col>
            </Row>
        </>);
    }
}

export default App;

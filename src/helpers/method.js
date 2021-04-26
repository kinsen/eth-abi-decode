const Web3 = require("web3");
// https://medium.com/@hayeah/how-to-decipher-a-smart-contract-method-call-8ee980311603
const _getMethodId = (method_abi) => {
    var method = _getMethodString(method_abi);
    return Web3.utils.sha3(method).slice(0, 10);
}

const _getMethodString = (method_abi) => {

    var method_name = method_abi.name;
    var inputs = method_abi.inputs;
    var parameters = inputs && inputs.length > 0 ? inputs.map(it => it.type).join(",") : '';
    return `${method_name}(${parameters})`;
}

const getMethodId = (abi) => {
    var methods = abi.filter(it => it.type == "function");
    var method_ids = {};
    for (var method of methods) {
        var methodStr = _getMethodString(method);
        var methodId = Web3.utils.sha3(methodStr).slice(0, 10);
        method_ids[methodStr] = methodId;
    }

    return method_ids;
}

const getAbiByMethodId = (abi, method_id) => {
    var methods = abi.filter(it => it.type == "function");
    for (var method of methods) {
        var methodStr = _getMethodString(method);
        var methodId = Web3.utils.sha3(methodStr).slice(0, 10);
        if (method_id == methodId)
            return method;
    }
    return null;
}

module.exports = { getMethodId, getAbiByMethodId };
var MemberSmart = artifacts.require("./initial.sol");
var EntryGateSmart = artifacts.require("./entrygate.sol");


module.exports = function(deployer) {
    deployer.deploy(MemberSmart);
    deployer.deploy(EntryGateSmart, MemberSmart.address);

};

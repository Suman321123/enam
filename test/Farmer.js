var FarmerSmart = artifacts.require("./Farmer.sol");

contract('FarmerSmart', function(accounts) {
    
    var FarmerInstance;
   
    it("adding the details of farmer to database", function() {
        return FarmerSmart.deployed().then((instance) => {
            FarmerInstance = instance;
            return FarmerInstance.addCheckHash.call("Farmerisbest")
        }).then((CheckHash) => {
            console.log(CheckHash);
            //assert.equal(CheckHash,"Farmerisbest","it worked correcty")
            return FarmerInstance.addFarmer.call("suman", CheckHash, "Male", "Saurav@123");
        }).then((NumberCount) => {
            console.log(NumberCount)
            return FarmerInstance.stringsEqual("suman","saurav")
        }).then((bool) => {
            console.log(bool)
            return FarmerInstance.checkFarmer.call("suman", "Saurav@123")
        }).then((status) => {
            console.log(status)
        })
    });

    



});
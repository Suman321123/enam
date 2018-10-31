pragma solidity ^0.4.4;

import "./initial.sol";

contract entrygate {

   /*===================================================STRINGS===========================================================*/
    struct EntryGate{
        string FarmerName;
        string FarmerOTS;
        string FarmerAddress;
        string FarmerMandi;
        string FarmerState;
        string ProductName;
        string ProductQuality;
        int ProductBagSize;
        int ProductNoBags;
    }

    int[] public LotNumber; 
    initial InitialContract;
    /*===================================================MAPPINGS===========================================================*/
    
    //Mapping for lot number to data of entry gate
    mapping(int => EntryGate) private FarmerEntryGate;
    

    /*===================================================EVENTS===========================================================*/
    
    //Event for adding entry gate data
    event DataIntoEntryGate(
       string indexed _ots,
       int lotnumber
    );

    /*===================================================FUNCTIONS===========================================================*/

    constructor(initial _initialcontract) public {
        InitialContract = _initialcontract;
    }
    
    // internal function to compare strings 
    function stringsEqual(string memory _a, string memory _b) public pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        if(a.length != b.length)
            return false;
        for (uint i=0; i < a.length; i++)
        {
            if(a[i] != b[i])
                return false;
        }
        return true;
    }
   
    //Function for adding data of EntryGate
    function AddEntryGate(int lotnumber, string fname, string fots, string fmandi, string fstate, string pname, string pquality, int pbs, int pnobag) public payable returns(bool) {

        LotNumber.push(lotnumber);

        FarmerEntryGate[lotnumber].FarmerName = fname;
        FarmerEntryGate[lotnumber].FarmerOTS = fots;
        FarmerEntryGate[lotnumber].FarmerMandi = fmandi;
        FarmerEntryGate[lotnumber].FarmerState = fstate;
        FarmerEntryGate[lotnumber].ProductName = pname;
        FarmerEntryGate[lotnumber].ProductQuality = pquality;
        FarmerEntryGate[lotnumber].ProductBagSize = pbs;
        FarmerEntryGate[lotnumber].ProductNoBags = pnobag;
        emit DataIntoEntryGate(fots, lotnumber);
        return true;
    }



}
pragma solidity ^0.4.4;

contract initial {


   /*==================================================STRINGS===========================================================*/
    
    struct Member {
        string uname;
        string checkGhash;
        string gender;
        string password;
        string actor;
        bool status;
    }

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
        int status;
    }

    struct ArrayLotNumber{
        int[] FarmerLOTArray;
    }
    
    //Data variables for bidding process
    // static
    address public owner;
    uint public bidIncrement;
    uint public startBlock;
    uint public endBlock;
    string public ipfsHash;

    // state
    bool public canceled;
    uint public highestBindingBid;
    address public highestBidder;
    bool ownerHasWithdrawn;

     
  
    /*===================================================ARRAYS===========================================================*/
    //List of all farmers
    Member[] allMembers;
    int[] public LotNumber;

    /*===================================================MAPPINGS===========================================================*/
    
    //Mapping for address to Farmer deatails stored in structure
    mapping(address => Member) private MemberAddress;
    //Mappping for storing OTS 
    mapping(address => string) public AllCheckHash;
    //Mapping for checking ony OTS issued for each user
    mapping(address => bool) public GAllCheckHash;
    //Mapping for lot number to data of entry gate
    mapping(int => EntryGate) private FarmerEntryGate;
    //Mapping for OTS to FarmerProduct's Lot Number so to store the Farmer's product in his database
    mapping(string => ArrayLotNumber) FarmerLOTNo;
    //Mapping for bidder to total bidding amount he/she bid
    mapping(address => uint256) public fundsByBidder;
   

    /*====================================================EVENTS==============================================================*/
    //Event for generaring OTS
    event GHashEvent(
        address indexed _owner,
        string CheckHash
    );
    //Event for registering user
    event RegisterEvent(
        address indexed _owner,
        string uname
    );
    //Event for adding entry gate data
    event DataIntoEntryGate(
       string indexed _ots,
       int lotnumber
    );

    /*=====================================================MODIFIERS============================================================*/
   
   //For checking the status of OTS
    modifier checkAllHash() {
        require(!GAllCheckHash[msg.sender]);
        _;
    }

    //For checking if member is already register or not
    modifier checkReg() {
        require(!MemberAddress[msg.sender].status);
        _;
    }
    
    /*=====================================================CONSTRUCTOR============================================================*/
    constructor() public {
        MemberAddress[msg.sender].status = false;
        
    }

    /*=====================================================FUNCTIONS============================================================*/
    
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

  
    //This function return unique hash to the farmer as prove of farmer
    function addCheckHash(string chash) public payable checkAllHash returns(bool) {
        AllCheckHash[msg.sender] = chash;
        GAllCheckHash[msg.sender] = true;
        emit  GHashEvent(msg.sender,chash);
        return true;
    }

    function getGhash() public view returns(string) {
        if(GAllCheckHash[msg.sender] == true)
            return AllCheckHash[msg.sender];
        return "null";  
    }
  
    //function for adding farmer to the system
    // return 6 if government does not approve it as farmer
    // return 1 when it get overflowed
    // return 0 on success
    function addMember(string uname, string CheckGhash, string actor, string gender, string password) public payable checkReg returns(bool) {
        //checking whether it is farmer otn not
        require(stringsEqual(AllCheckHash[msg.sender],CheckGhash));
       
        MemberAddress[msg.sender].uname = uname;
        MemberAddress[msg.sender].checkGhash = CheckGhash;
        MemberAddress[msg.sender].actor = actor;
        MemberAddress[msg.sender].gender = gender;
        MemberAddress[msg.sender].password = password;
        MemberAddress[msg.sender].status = true;
        emit RegisterEvent(msg.sender,uname);
        return true;
      
    }
    
    //function for checking the loging system
    function checkMember(string uname, string password) public payable returns(uint, string) {
        if(stringsEqual(MemberAddress[msg.sender].uname,uname) && stringsEqual(MemberAddress[msg.sender].password, password))
        {
            return (0, MemberAddress[msg.sender].actor);
        }
        return (1, "null");
        
    }

    //--------FUNCTIONS FOR ENTRY GATE------//
    
    //Function for adding data of EntryGate
    function AddEntryGate(int lotnumber, string fname, string fots, string fmandi, string fstate, string pname, string pquality, int pbs, int pnobag) public payable returns(bool) {

        LotNumber.push(lotnumber);

        FarmerLOTNo[fots].FarmerLOTArray.push(lotnumber);
      
        FarmerEntryGate[lotnumber].FarmerName = fname;
        FarmerEntryGate[lotnumber].FarmerOTS = fots;
        FarmerEntryGate[lotnumber].FarmerMandi = fmandi;
        FarmerEntryGate[lotnumber].FarmerState = fstate;
        FarmerEntryGate[lotnumber].ProductName = pname;
        FarmerEntryGate[lotnumber].ProductQuality = pquality;
        FarmerEntryGate[lotnumber].ProductBagSize = pbs;
        FarmerEntryGate[lotnumber].ProductNoBags = pnobag;
        FarmerEntryGate[lotnumber].status = 0;
        emit DataIntoEntryGate(fots, lotnumber);
        return true;
    }

   //Function for  geting total count of LOTNUMBER of perticular farmer
    function GetLotCount(string fots) public returns(uint) {
        return FarmerLOTNo[fots].FarmerLOTArray.length;
    }

    //Function for changing status after farmer confirmed
    function ChangeStatus(int lotnumber) public returns(bool)
    {
        FarmerEntryGate[lotnumber].status = 1;  
        return true;
    }

    //Function for changing status after farmer rejected the product
    function DenyProduct(int lotnumber) public returns(bool)
    {
        FarmerEntryGate[lotnumber].status = 5;  
        return true;
    }
    
    //Function for returning product details to Farmer
    function FarmerGetProduct(uint index) public returns(int, string, string, string, string ,int, int, int) {

        string ots1 = AllCheckHash[msg.sender];

        for(uint i=index;i<FarmerLOTNo[ots1].FarmerLOTArray.length;i++)
        {
            return (FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].status, FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].FarmerMandi, FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].FarmerState, FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].ProductName,  FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].ProductQuality, FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].ProductNoBags, FarmerEntryGate[FarmerLOTNo[ots1].FarmerLOTArray[i]].ProductBagSize, FarmerLOTNo[ots1].FarmerLOTArray[i]);
        }
        
        return (0,"null","null","null","null",0,0,0);  
    }
    
    //-----ENDING-----//


    //--------------BIDING PROCESS--------------//
    
        
   
    //-------ENDING----//


    
    

}
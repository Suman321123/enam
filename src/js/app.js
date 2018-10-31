var lastname = sessionStorage.getItem("UserName");
var actor = sessionStorage.getItem("actor");
if(lastname)
{ 
    $("#nav-form").hide()
    $("#fname").html('<ul id="nav-form" class="nav navbar-nav navbar-right ml-auto"><li class="nav-item"><a data-toggle="dropdown" class="nav-link dropdown-toggle" href="#">'+lastname+'</a></li><li class="nav-item"><a href="#" onClick="App.logout()" class="btn btn-primary dropdown-toggle get-started-btn mt-1 mb-1">Logout</a></li></ul>')
    if(actor == "GovtEmployee")
    {
      $("#navbarUl").append("<li class=\"nav-item\"><a href=\"EntryGate.html\" class=\"nav-link\">Entry Gate</a></li>")
    }
}


App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',


  init: function() {
      //Checking whether metamask is installed or not
      if (typeof web3 !== 'undefined'){
         console.log('MetaMask is installed')
         console.log("loaded successfully")
         return App.initWeb3();
      } 
      else{
        swal("ERROR!", "Please Install METAMASK To Continue", "warning")
      }
  },

  initWeb3: function() {
     // TODO: refactor conditional
     if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    //Checking whether connected to metamask or not
    web3.eth.getAccounts(function(err, accounts){
      if (err != null) {
         console.log(err)
      }
      else if (accounts.length === 0) {
        swal("ERROR!", "Please Login In METAMASK", "warning")
      }
      else {
         console.log('MetaMask is unlocked')
      }
   });
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('initial.json', (memberContract) => {
        // Instantiate a new truffle contract from the artifact
      App.contracts.MemberContract = TruffleContract(memberContract);
      // Connect provider to interact with contract
      App.contracts.MemberContract.setProvider(App.web3Provider);
      App.contracts.MemberContract.deployed().then(function(memberContract) {
        console.log("Farmer contract Address:", memberContract.address);
      })
      App.listenForEvents();
      return App.render();
    })
    // .done( () => {
    //   $.getJSON('GovEmp.json', (GovEmpContract) => {
    //     // Instantiate a new truffle contract from the artifact
    //   App.contracts.GovEmpContract = TruffleContract(GovEmpContract);
    //   // Connect provider to interact with contract
    //   App.contracts.GovEmpContract.setProvider(App.web3Provider);
    //   App.contracts.GovEmpContract.deployed().then(function(GovEmpContract) {
    //     console.log("GovEmp contract Address:", GovEmpContract.address);
    //   })
    // })
  
    // })
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.MemberContract.deployed().then(function(instance) {
      FarmerInstance = instance
      instance.GHashEvent({}, {
        fromBlock: 0,
        toBlock: 'latest',
      }).watch(function(error, event) {
        console.log("event triggered", event);
        App.render();
      })
    })
  },

  render: function() {
    
    var add = document.getElementById("address");
     // Load account data
     web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#address').html(account);
      }
    })

    App.contracts.MemberContract.deployed().then((instance) => {
      MemberInstance = instance;
      return MemberInstance.GAllCheckHash(App.account)
    }).then( (result) => {
      if(result)
      {
        $("#gsubmit").prop('disabled', true).css('cursor','no-drop');
        $("#Guname").prop('disabled', true).css('cursor','no-drop');
        $("#adhar").prop('disabled', true).css('cursor','no-drop');
        $('#formFooter1').html('Forget Your OTS ?<br><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#myModal">Click Here</button>')
        
      }
      return MemberInstance.CheckStatus.call()   
    }).then( (result) => {
      console.log(result[2].toNumber())
  })
  },

  generateHash: function() {
      $("#cpa-form").submit(function(e){
        e.preventDefault();
      });
      $('#formFooter1').html("")
      var uname = $('#Guname').val()
      var adhar = $('#adhar').val()
      var HashString = web3.sha3(web3.sha3(adhar,uname))
      $("#gsubmit").val("Loading....")
      var explode = function(){
        $("#gsubmit").val("Enter")
        $('#formFooter').html('<p style="color:green">Verified </p>Click below for OTS: <br><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#myModal">Click Here</button>')
        $("#cpa-form").trigger('reset');
        $("#Guname").prop('disabled', true).css('cursor','no-drop');
        $("#adhar").prop('disabled', true).css('cursor','no-drop');
      };
      App.contracts.MemberContract.deployed().then((instance) => {
        MemberInstance = instance;
        return instance.addCheckHash.sendTransaction(HashString, {
          from: App.account, 
        })
      }).then((result) => {
        if(result) {
          setTimeout(explode, 3000);
        }
      })
      $("#modal_body").html('<p id="gKey" class="alert alert-success"> Key :' +HashString +'</p><p style="color:red;">*Do not share this to anyone</p><p style="color:red;">*This is only one time key for registration</p>' )
  },

  registerFarmer: function() {
      var uname = $('#SignUname').val();
      var upassword = $("#SignUpassword").val();
      var ucpassword = $("#SignUcpassword").val();
      var chash = $("#chash").val();
      var gender = $("#gender").val();
      var actor = $("#actor").val();
      $("#reg-but").val("loading...")
      var explode = function(){
        $("#reg-but").val("Sign up")
        $("#reg-form").trigger('reset');
      };
        App.contracts.MemberContract.deployed().then(function(instance) {
          MemberInstance = instance
          return MemberInstance.hasGhash()
        }).then( (result) => {
            console.log(result)
            if(chash != result)
            {
              if(upassword != ucpassword)
              { 
                $("#error1").html('<p style="color:red;font-size:14px;">*Password does not match</p>')       
                $("#error2").html('<p style="color:red;font-size:14px;">*Enter OTS is wrong</p>')
                $("#reg-form").trigger('reset');
                return false  
              }
              $("#error2").html('<p style="color:red;font-size:14px;">*Enter OTS is wrong</p>')
              $("#reg-form").trigger('reset');
              return false;
            }   
            return MemberInstance.addMember.sendTransaction(uname, chash, actor, gender, upassword, {
              from:App.account,
          })
        }).catch((err) => {
          swal("ERROR!", "Something went wrong or Already Register", "warning")
          $("#reg-form").trigger('reset');
        }).then( (result) => {
          if(result)
          {
            setTimeout(explode, 3000)
            swal("Congratulations!", "Sucessfuly Registered!", "success")
            $("#reg-form").trigger('reset')
            
          }
          else
          {
            setTimeout(explode, 1000)
            
          }
        })
  },
  
  loginFarmer: function() {          
    var uname = $("#uname").val()
    var upassword = $("#upassword").val()
    App.contracts.MemberContract.deployed().then( (instance) => {
      MemberInstance = instance
      return FarmerInstance.checkMember.call(uname, upassword)
    }).then( (result) => {
        console.log(result)
        if(result[0].toNumber() == 0)
        {
         // swal("Good job!", "Successfully login", "success");
          $("#log-form").trigger("reset")
          $("#nav-form").hide();
          sessionStorage.setItem("UserName",uname);
          sessionStorage.setItem("actor",result[1])
        }
        else
        {
          swal("Error", "Check Username or Password", "warning");
        }
        location.reload();
    })
  },

  logout: function() {
    sessionStorage.removeItem("UserName")
    window.location = '/';
  }


  

}

$(function() {
  $(window).load(function() {
    App.init();
  });
});

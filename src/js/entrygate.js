var number
$(document).ready(function () {
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    
    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);
    
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);

    });
    $(".prev-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}
      
AppGovEmp = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
  
    init: function() {
        //Checking whether metamask is installed or not
        if (typeof web3 !== 'undefined'){
           console.log("loaded successfully")
           number = (Math.random() + '').substring(2,10)+ (Math.random() + '').substring(2,10)
           $('#lotnumber').html("Your Lot Number is :- <b>"+number+"</b>")
           return AppGovEmp.initWeb3();
        } 
        else{
          swal("ERROR!", "Please Install METAMASK To Continue", "warning")
        }
    },
  
    initWeb3: function() {
       // TODO: refactor conditional
       if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        AppGovEmp.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        AppGovEmp.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return AppGovEmp.initContract();
    },
  
    initContract: function() {
      $.getJSON('initial.json', (entrygateContract) => {
        // Instantiate a new truffle contract from the artifact
        AppGovEmp.contracts.EntryGateContract = TruffleContract(entrygateContract);
        // Connect provider to interact with contract
        AppGovEmp.contracts.EntryGateContract.setProvider(App.web3Provider);
        AppGovEmp.contracts.EntryGateContract.deployed().then(function(entrygateContract) {
          console.log("Entry Gate contract Address:", entrygateContract.address);
        })
        AppGovEmp.listenForEvents();
        return AppGovEmp.render();
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
      AppGovEmp.contracts.EntryGateContract.deployed().then(function(instance) {
        FarmerInstance = instance
        instance.DataIntoEntryGate({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
          AppGovEmp.render();
        })
      })
    },
  
    render: function() {
       // Load account data
       web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
          AppGovEmp.account = account;
          $('#address').html(account);
        }
      })
    },
    
    EntryGate: function() {
      //Farmer Details
      var fname = $("#inputName4").val()
      var fpublic = $("#inputPassword4").val()
      var faddress = $("#inputAddress").val()
      var faddress2 = $("inputAddress2").val()
      var fcity = $("#inputCity").val()
      var fmandi = $("#inputMandi").val()
      var fstate = $("#inputState").val()
      var fzip = $("#inputCity").val()
      //Products Details
      var pname = $("#inputProductName4").val()
      var pquality = $("#inputQuality4").val()
      var ptrans = $("#inputTransport").val()
      var ptransnumber = $("#inputTransportNumber").val()
      var pbagsize = $("#inputBagSize").val()
      var pnobags = $("#inputNumberBags").val()
      var pquintal = $("#inputQuintals").val()
      //Genertaing template for invoice
      console.log(pnobags)
      AppGovEmp.contracts.EntryGateContract.deployed().then( (instance) => {
        EntryGateInstance = instance
        return EntryGateInstance.AddEntryGate.sendTransaction(number, fname, fpublic, fmandi, fstate, pname, pquality, pbagsize, pnobags, {
          from:AppGovEmp.account,
        })
     }).then( (result) => {
            if(result)
            {
              $("#com1").html("Complete")
              $("#com2").html("You have successfully completed all steps.")
              setTimeout( () => {
                $("#invoice").html("<center><img style=\"margin-left:100px\" src=\"images/enamlogo.png\"></center><div style=\"font-size:20px;margin-left:200px;margin-bottom:7px;\"><b>Lot Number :</b>"+number+"</div><br><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Name :</b>"+fname+"</div><br><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>OTS :</b>"+fpublic+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>address1 :</b>"+faddress+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>address2 :</b>"+faddress2+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>city :</b>"+fcity+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Mandi :</b>"+fmandi+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>State :</b>"+fstate+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Zip :</b>"+fzip+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Product Name :</b>"+pname+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Product Variety :</b>"+pquality+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Vehicle :</b>"+ptrans+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Vehicle Number:</b>"+ptransnumber+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Bag Size:</b>"+pbagsize+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Number Of Bags:</b>"+pnobags+"</div><div style=\"font-size:15px;margin-left:200px;margin-bottom:7px;\"><b>Quintals</b>"+pquintal+"</div>")
              $("#invo").html("<div style=\"border:2px solid black;\" class=\"row\"><center><img src=\"images/enamlogo.png\"></center><div  class=\"col-sm-12\" style=\"font-size:20px;margin-bottom:7px;\"><b>Lot Number :</b>"+number+"</div><br><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Name :</b>"+fname+"</div><br><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>OTS :</b>"+fpublic+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>address1 :</b>"+faddress+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>address2 :</b>"+faddress2+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>city :</b>"+fcity+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Mandi :</b>"+fmandi+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>State :</b>"+fstate+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Zip :</b>"+fzip+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Product Name :</b>"+pname+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Product Variety :</b>"+pquality+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Vehicle :</b>"+ptrans+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Vehicle Number:</b>"+ptransnumber+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Bag Size:</b>"+pbagsize+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Number Of Bags:</b>"+pnobags+"</div><div  class=\"col-sm-12\" style=\"font-size:15px;margin-bottom:7px;\"><b>Quintals</b>"+pquintal+"</div></div>")
              },2000)
            }
     })
     
      //Connecting to solidity function
      
     
    },

    demoFromHTML: function(){
      $("#download").html("Downloading...")
      setTimeout(() => {
        var pdf = new jsPDF('p', 'pt', 'letter');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        source = $('#invoice')[0];
    
        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        };
        margins = {
            top:30,
            bottom:80, 
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
        source, // HTML string or DOM elem ref.
        margins.left, // x coord
        margins.top, { // y coord
            'width': margins.width, // max width of content on PDF
            'elementHandlers': specialElementHandlers
        },
    
        function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF 
            //          this allow the insertion of new lines after html
            pdf.save('Test.pdf');
        }, margins);
      }, 3000)
      setTimeout(() => {
        $("#download").html("Save And Download")
      },3000)
  },
  
  }
  
  $(function() {
    $(window).load(function() {
        AppGovEmp.init();
    });
  });
  
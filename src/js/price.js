let status = 0;
fetch('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000016afbd6647468443a4410f224345cb31b&format=json&offset=0&limit=1000')
.then(response => response.json())
.then(data => {
    //Initial stage 
    if($(".dyn").val() == 0)
    { 
        let dynvalue = "suman";
        for(var i=0;i<1000;i++)
        {   if(dynvalue!=data.records[i].commodity)
            {
                //Filling the commodity section
                dynvalue = data.records[i].commodity;
                $(".dyn3").append('<option>'+data.records[i].commodity+'</option>')
            }
            $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
        }
    }

    //Onchanging the option of state
    $('select.dyn').change(function(){
        $(".dyn1").html("")
        $(".dyn1").append('<option value=0>Select District</option>')
        $(".dyn2").html("")
        $(".dyn2").append('<option value=0>Select Market</option>')
        $(".dyn3").html("")
        $(".dyn3").append('<option value=0>Select Commodity</option>')
        //If the state field is reset
        if($(".dyn").val() == 0)
        {
            $("#table").html("");
            let dynvalue = "suman";
            for(var i=0;i<1000;i++)
            {
                if(dynvalue!=data.records[i].commodity)
                {
                    dynvalue = data.records[i].commodity;
                    $(".dyn3").append('<option>'+data.records[i].commodity+'</option>')
                }
                console.log(data.records[i].state)
                $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            }
        }
        else
        {
            $("#table").html("")
            for(var i=0;i<1000;i++)
            {
                if($(".dyn").val() == data.records[i].state)
                    $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            }
        }
        //Dynamically changing the content of district option
        $(".dyn1").html('')
        $(".dyn1").append('<option value=0>Select District</option>')
        let dynvalue = "suman";
        for(var i=0;i<1000;i++)
        {   
            if($('.dyn').val() == data.records[i].state)
            {
                if(dynvalue!=data.records[i].district)
                {
                    dynvalue = data.records[i].district;
                    $(".dyn1").append('<option value="'+data.records[i].district+'">'+data.records[i].district+'</option>')
                }
            }
        }
    });
    //Onchanging the district option
    $('select.dyn1').change(function(){
        $(".dyn2").html("")
        $(".dyn2").append('<option value=0>Select Market</option>')
        //If the district field is reset
        if($(".dyn1").val() == 0)
        {
            $("#table").html(" ")
            for(var i=0;i<1000;i++)
            {   
                if($('.dyn').val() == data.records[i].state)
                   $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            } 
        }
        else
        {
            //Onchanging the district
            $("#table").html("");
            for(var i=0;i<1000;i++)
            {   
                if(($('.dyn1').val() == data.records[i].district))
                    $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            }
            //Dynamically changing the content of market
            $(".dyn2").html('')
            $(".dyn2").append('<option value=0>Select Market</option>')
            let dynvalue = "suman";
            for(var i=0;i<1000;i++)
            {  
                if($('.dyn1').val() == data.records[i].district)
                {
                    if(dynvalue!=data.records[i].market)
                    {
                        dynvalue = data.records[i].market;
                        $(".dyn2").append('<option>'+data.records[i].market+'</option>')
                    }
                }
            }
        }
        
    });
   
    //Onchanging the market option
    $('select.dyn2').change(function(){
        $(".dyn3").html("")
        //If the market field is reset
        if($(".dyn2").val() == 0)
        {
            $("#table").html(" ")
            for(var i=0;i<1000;i++)
            {   
                if($('.dyn1').val() == data.records[i].district)
                   $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            } 
        }
        else
        {
            //Onchanging the market
            $("#table").html("");
            for(var i=0;i<1000;i++)
            {   
                if(($('.dyn2').val() == data.records[i].market))
                    $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            }
            //Dynamically changing the content of commodity
            $(".dyn3").append('<option value=0>Select Comodity</option>')
            for(var i=0;i<1000;i++)
            {  
                if($('.dyn2').val() == data.records[i].market)
                {
                        $(".dyn3").append('<option>'+data.records[i].commodity+'</option>')
                }
            }
        }

    });

   //Onchanging the commodity option
   $('select.dyn3').change(function() {
       //Checking intially 
        if($(".dyn3").val() == 0)
        {
            //Checking if not intially
            if($('.dyn2').val() !=0)
            {
                $("#table").html(" ")
                for(var i=0;i<1000;i++)
                {   
                    if($('.dyn2').val() == data.records[i].market)
                        $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
                } 
            }
            else
            {
                for(var i=0;i<1000;i++)
                    $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
            }
        }
        else
        {
            //Checking if not intially
            if($('.dyn2').val() !=0)
            {
                $("#table").html("");
                for(var i=0;i<1000;i++)
                {   
                    if($('.dyn3').val() == data.records[i].commodity && $('.dyn2').val() == data.records[i].market)
                        $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
                }
            }
            else
            {
                $("#table").html("");
                for(var i=0;i<1000;i++)
                {   
                    if($('.dyn3').val() == data.records[i].commodity)
                        $("#table").append('<tr><td data-title="state">'+data.records[i].state+'</td><td data-title="district">'+data.records[i].district+'</td><td data-title="market">'+data.records[i].market+'</td><td data-title="commodity">'+data.records[i].commodity+'</td><td data-title="variety">'+data.records[i].variety+'</td><td data-title="Open" class="numeric">'+data.records[i].min_price+'</td><td data-title="High" class="numeric">'+data.records[i].max_price+'</td><td data-title="modal" class="numeric">'+data.records[i].modal_price+'</td>')
                }
            }
        }   
   });

    // Prints result from `response.json()` in getRequest
}).catch(error => console.error(error))


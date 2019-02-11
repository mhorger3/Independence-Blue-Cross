configApp.controller('mnemonicInfoController', function($scope, $routeParams, $location, dataTransfer) {
    // the model is unique to the mnemonic
    $scope.model = {
        id: $routeParams.id // and the id for the mnemonic is it's name
    };

    $scope.name = $routeParams.id;

    $scope.currentMnemonic = {
        name: $scope.name
    };
    
    $(window).on("unload", function(e) {
        console.log("store local lists into storage");
         sessionStorage.setItem('qa', JSON.stringify(dataTransfer.getQA())); 
    });

$(document).ready(function() {
        var QAConnection = sessionStorage.getItem('qa'); // get whatever local objects are stored in sessionStorage
        var QAparse = jQuery.parseJSON(QAConnection); // parse them for json
        if(dataTransfer.getQA() === null){
            if(QAparse !== null) { // if the results aren't empty
                dataTransfer.setQA(QAparse); // save them into our angular service
            } else {
                dataTransfer.setQA([]);
            }
        }
        var data0 = {"amount": -1};
        var json = JSON.stringify(data0);        
        // ajax call that gets the full packages
        $.ajax({
            type: 'POST',
            url: "http://paea0003:4567/api/packages",
            processData: true,
            crossDomain: true,
            data: json,
            dataType: "json",
            success: function(data) {
                console.log(data);
                $scope.$apply(function(){
                $scope.packages = data.data;
            });
                $('#associativePackages').DataTable({
                lengthChange: false,
                pageLength: 5
                });
                $('#loading').hide();
            }
        });
        
        
          // ajax call that gets the mnemonic information for the given name
        $.ajax({
            type: 'POST',
            url: "http://paea0003:4567/api/mnemonics/" + $scope.name + "/get",
            processData: true,
            crossDomain: true,
            data: {},
            dataType: "json",
            success: function(data) {
              $scope.$apply(function(){
                      //$scope.packages = data.data;
                      //$scope.decodeAdditionalInfo(); // need to decode the package information
                      console.log("Got Data!");
                         $scope.currentMnemonic = data.data[0];
                         $scope.decodeAdditionalInfo($scope.currentMnemonic, data.data[0].additionalInfoText);
                      console.log($scope.currentMnemonic);
                  });
            }
        });
        // function that encodes the info for regex form
        $scope.encodeAdditionalInfo = function(string) {
            var localObject = {
                mobileDisplayText: $scope.mobile,
                usage: $scope.usage,
                navigable: $scope.navigable
            };
            return JSON.stringify(localObject);
        };
        // function that decodes the info from regex
        $scope.decodeAdditionalInfo = function(object, string) {
            if(string.substr(0, 1) === "{") {
                var local = JSON.parse(string);
                object.mobile = local.mobileDisplayText;
                object.usage = local.usage;
                object.navigable = local.navigable;
            } else {
                object.mobile = "";
                object.usage = "";
                object.navigable = "";
            }
        };

    });

    $scope.searchKeyword = '';
    $scope.visibilityObjects = [];
    // local visibility settings fields
    $scope.visibility = [{
        fullyInsured: '',selfInsured: '',medical: '',dental: '',
        vision: '',rx: '',rxClaims: '',rxClaimsInd: '',
        rxClaimsSm: '',rxClaimsLg: '',hmo: '',pos: '',
        ppo: '',pho: '',posPlus: '',posPlusSEH: '',
        ucciDental: '',blueDental: '',hsa: '',enrollHSA: '',
        fsa: '',hra: '',dca: '',multiplan: '',
        idTheft: '',cce: '',hcr: '',telemedicine: '',
        reward: '',challenge: '',wellnessCore: '',individual: '',
        smallGroup: '',largeGroup: '',directPay: '',blueExtraBasic: '',
        blueExtraPlus: '', medicare: '',mediGap: '',subscriber: '',
        spouse: '',spouse_dep: '',dept: '',preEffectuated: '',
        future: '',active: '',termed: '',demo: '',
        windowsDesktop: '',macDesktop: '',androidDesktop: '',ipadDesktop: '',
        androidTablet: '',ipadTablet: '',windowsTablet: '',androidPhone: '',
        iosPhone: '',androidMobile: '',iosMobile: '',windowsMobile: '',
        DEV: '',QA: '',PROD: '',global: ''
    }];

    // visibility fields for the modal
    $scope.visibilityModal = [{
        fullyInsured: '',selfInsured: '',medical: '',dental: '',
        vision: '',rx: '',rxClaims: '',rxClaimsInd: '',
        rxClaimsSm: '',rxClaimsLg: '',hmo: '',pos: '',
        ppo: '',pho: '',posPlus: '',posPlusSEH: '',
        ucciDental: '',blueDental: '',hsa: '',enrollHSA: '',
        fsa: '',hra: '',dca: '',multiplan: '',
        idTheft: '',cce: '',hcr: '',telemedicine: '',
        reward: '',challenge: '',wellnessCore: '',individual: '',
        smallGroup: '',largeGroup: '',directPay: '',blueExtraBasic: '',
        blueExtraPlus: '', medicare: '',mediGap: '',subscriber: '',
        spouse: '',spouse_dep: '',dept: '',preEffectuated: '',
        future: '',active: '',termed: '',demo: '',
        windowsDesktop: '',macDesktop: '',androidDesktop: '',ipadDesktop: '',
        androidTablet: '',ipadTablet: '',windowsTablet: '',androidPhone: '',
        iosPhone: '',androidMobile: '',iosMobile: '',windowsMobile: '',
        DEV: '',QA: '',PROD: '',global: ''
    }];

    // function that loads the visibility settings for a given package
    $scope.loadVisibility = function() {
        $('#loading').show();
        var package = $scope.loadSettings;
        // we need to pop the template visibility out for starters, other packages if you choose to view multiple
        $scope.visibility.pop();

        if(package === "") {
            $scope.visibility.push({});
        } else {
            // ajax call that gets the visibility settings for a given package
           $.ajax({
                type: 'POST',
                url: "http://paea0003:4567/api/packages/" + package + "/settings/" + $scope.name + "/get",
                processData: true,
                crossDomain: true,
                data: {},
                dataType: "json",
                success: function(data) {
                    $scope.$apply(function(){
                        var visibilityObject = {};
                        visibilityObject = $scope.decodeGlobal(visibilityObject, data.data[0].globalSettingsCode);
                        visibilityObject = $scope.processRegexString(visibilityObject, data.data[0].unoptimizedEnabledRegexText);
                        $scope.visibility.push(visibilityObject);
                        $('#loading').hide();
                    });
                }
            });
        }
    };

    // function that loads the visibility settings for the modal
    $scope.loadModalSettings = function() {
        // given the user selection
        var package = $scope.loadSettingsModal;
        // we need to pop the template visibility out on load - other packages upon selection
        $scope.visibilityModal.pop();

        if(package === "") {
            $scope.visibilityModal.push({});
        } else {
            $.ajax({
                type: 'POST',
                url: "http://paea0003:4567/api/packages/" + package + "/settings/" + $scope.name + "/get",
                processData: true,
                crossDomain: true,
                data: {},
                dataType: "json",
                success: function(data) {
                    $scope.$apply(function(){
                        var visibilityObject = {};
                        visibilityObject = $scope.decodeGlobal(visibilityObject, data.data[0].globalSettingsCode);
                        visibilityObject = $scope.processRegexString(visibilityObject, data.data[0].unoptimizedEnabledRegexText);
                        $scope.visibilityModal.push(visibilityObject);
                    });                            
                    // for each visibility setting in the local variable, we need to check the appropriate boxes in the modal
                    var list = $scope.visibilityModal[0];
                    for(var setting in list) {
                        if(setting === "global"){
                            if(list[setting] === "active"){
                                // need to check for conditional override
                                $("input[name='override'][value='enabled']").prop("checked",true);
                            } else if(list.global === "conditional"){
                                $("input[name='override'][value='conditional']").prop("checked",true);
                            } else if(list.global === "disabled"){
                                $("input[name='override'][value='disabled']").prop("checked",true);
                            }
                        } else if(list[setting] === "active") {
                            document.getElementById(setting + "Box").checked = true;
                        }
                    }
                    alert("Data Loaded!");
                }
            });
            
        }
    };
    // function that decodes the Global setting
    $scope.decodeGlobal = function(visibilityObject, code) {
        if(code === "E") {
            visibilityObject.global = 'active';            
        } else if(code === "C") {
            visibilityObject.global = 'conditional';

        } else if(code === "D") {
            visibilityObject.global = 'disabled';
        }
        return visibilityObject;
    };
    // function that separates the regex string into js object form
    $scope.processRegexString = function(visibilityObject, regex){
        var group = [];
        var newTxt = regex.split('(');
        for (var i = 1; i < newTxt.length; i++) {
            group[i] = newTxt[i].split(')')[0];    
        }

        $scope.groupA = group[1].split("|");
        $scope.groupB = group[2].split("|");   
        $scope.groupC = group[3].split("|");  
        $scope.groupD = group[4].split("|");  
        $scope.groupE = group[5].split("|"); 
        for(var i = 0; i < $scope.groupA.length; i++){
            if($scope.groupA[i] == "fi") {visibilityObject.fullyInsured = "active";}
            if($scope.groupA[i] == "sf") {visibilityObject.selfInsured = "active";}
            if($scope.groupA[i] == "m") {visibilityObject.medical = "active";}
            if($scope.groupA[i] == "d") {visibilityObject.dental = "active";}
            if($scope.groupA[i] == "v") {visibilityObject.vision = "active";}
            if($scope.groupA[i] == "rx") {visibilityObject.rx = "active";}
            if($scope.groupA[i] == "rxc") {visibilityObject.rxClaims = "active";}
            if($scope.groupA[i] == "rxci") {visibilityObject.rxClaimsInd = "active";}
            if($scope.groupA[i] == "rxcsg") {visibilityObject.rxClaimsSm = "active";}
            if($scope.groupA[i] == "rxcg") {visibilityObject.rxClaimsLg = "active";}
            if($scope.groupA[i] == "hmo") {visibilityObject.hmo = "active";}
            if($scope.groupA[i] == "pos") {visibilityObject.pos = "active";}
            if($scope.groupA[i] == "ppo") {visibilityObject.ppo = "active";}
            if($scope.groupA[i] == "pho") {visibilityObject.pho = "active";}
            if($scope.groupA[i] == "posp") {visibilityObject.posPlus = "active";}
            if($scope.groupA[i] == "seh") {visibilityObject.posPlusSEH = "active";}
            if($scope.groupA[i] == "ud") {visibilityObject.ucciDental = "active";}
            if($scope.groupA[i] == "bd") {visibilityObject.blueDental = "active";}
            if($scope.groupA[i] == "hsa") {visibilityObject.hsa = "active";}
            if($scope.groupA[i] == "ehsa") {visibilityObject.enrollHSA = "active";}
            if($scope.groupA[i] == "fsa") {visibilityObject.fsa = "active";}
            if($scope.groupA[i] == "hra") {visibilityObject.hra = "active";}
            if($scope.groupA[i] == "dca") {visibilityObject.dca = "active";}
            if($scope.groupA[i] == "mp") {visibilityObject.multiplan = "active";}
            if($scope.groupA[i] == "idt") {visibilityObject.idTheft = "active";}
            if($scope.groupA[i] == "cce") {visibilityObject.cce = "active";}
            if($scope.groupA[i] == "hcr") {visibilityObject.hcr = "active";}
            if($scope.groupA[i] == "tmd") {visibilityObject.telemedicine = "active";}
            if($scope.groupA[i] == "rwd") {visibilityObject.reward = "active";}
            if($scope.groupA[i] == "chl") {visibilityObject.challenge = "active";}
            if($scope.groupA[i] == "wco") {visibilityObject.wellnessCore = "active";}
            if($scope.groupA[i] == "ind") {visibilityObject.individual = "active";}
            if($scope.groupA[i] == "sg") {visibilityObject.smallGroup = "active";}
            if($scope.groupA[i] =="lg") {visibilityObject.largeGroup = "active";}
            if($scope.groupA[i] == "dp") {visibilityObject.directPay = "active";}
        }
        for(var i = 0; i < $scope.groupB.length; i++){
            if($scope.groupB[i] ==  "beb") {visibilityObject.blueExtraBasic = "active";}
            if($scope.groupB[i] == "bep") {visibilityObject.blueExtraPlus = "active";}
            if($scope.groupB[i] == "mc") {visibilityObject.medicare = "active";}
            if($scope.groupB[i] == "mg") {visibilityObject.mediGap = "active";}
            if($scope.groupB[i] == "sub") {visibilityObject.subscriber = "active";}
            if($scope.groupB[i] == "sps") {visibilityObject.spouse = "active";}
            if($scope.groupB[i] == "dep1") {visibilityObject.spouse_dep = "active";}
            if($scope.groupB[i] == "dep2") {visibilityObject.dept = "active";}
        }
         for(var i = 0; i < $scope.groupC.length; i++){
            if($scope.groupC[i] == "pe") {visibilityObject.preEffectuated = "active";}
            if($scope.groupC[i] == "fut") {visibilityObject.future = "active";}
            if($scope.groupC[i] == "act") {visibilityObject.active = "active";}
            if($scope.groupC[i] == "term") {visibilityObject.termed = "active";}
            if($scope.groupC[i] == "dem") {visibilityObject.demo = "active";}
        }
        for(var i = 0; i < $scope.groupD.length; i++){
            if($scope.groupD[i] == "wdw") {visibilityObject.windowsDesktop = "active";}
            if($scope.groupD[i] == "mdw") {visibilityObject.macDesktop = "active";}
            if($scope.groupD[i] == "atdw") {visibilityObject.androidDesktop = "active";}
            if($scope.groupD[i] == "itdw") {visibilityObject.ipadDesktop = "active";}
            if($scope.groupD[i] == "atn") {visibilityObject.androidTablet = "active";}
            if($scope.groupD[i] == "itn") {visibilityObject.ipadTablet = "active";}
            if($scope.groupD[i] == "wtn") {visibilityObject.windowsTablet = "active";}
            if($scope.groupD[i] == "apn") {visibilityObject.androidPhone = "active";}
            if($scope.groupD[i] == "ipn") {visibilityObject.iosPhone = "active";}
            if($scope.groupD[i] == "aps") {visibilityObject.androidMobile = "active";}
            if($scope.groupD[i] == "ips") {visibilityObject.iosMobile = "active";}
            if($scope.groupD[i] == "wps") {visibilityObject.windowsMobile = "active";}
        }
        for(var i = 0; i < $scope.groupE.length; i++){
            if($scope.groupE[i] == "d") {visibilityObject.DEV = "active";}
            if($scope.groupE[i] == "q") {visibilityObject.QA = "active";}
            if($scope.groupE[i] == "p") {visibilityObject.PROD = "active";}
        }        
        return visibilityObject;
    }; 

    // function that gets called when we make a submission - generates regex strings
    $scope.checkSubmitRegex = function() {
        var package = $scope.loadSettingsModal;
        var visibilityObject = {
        fullyInsured: '',selfInsured: '',medical: '',dental: '',
        vision: '',rx: '',rxClaims: '',rxClaimsInd: '',
        rxClaimsSm: '',rxClaimsLg: '',hmo: '',pos: '',
        ppo: '',pho: '',posPlus: '',posPlusSEH: '',
        ucciDental: '',blueDental: '',hsa: '',enrollHSA: '',
        fsa: '',hra: '',dca: '',multiplan: '',
        idTheft: '',cce: '',hcr: '',telemedicine: '',
        reward: '',challenge: '',wellnessCore: '',individual: '',
        smallGroup: '',largeGroup: '',directPay: '',blueExtraBasic: '',
        blueExtraPlus: '', medicare: '',mediGap: '',subscriber: '',
        spouse: '',spouse_dep: '',dept: '',preEffectuated: '',
        future: '',active: '',termed: '',demo: '',
        windowsDesktop: '',macDesktop: '',androidDesktop: '',ipadDesktop: '',
        androidTablet: '',ipadTablet: '',windowsTablet: '',androidPhone: '',
        iosPhone: '',androidMobile: '',iosMobile: '',windowsMobile: '',
        DEV: '',QA: '',PROD: '',global: ''
        };
        // for each category, write the appropriate regex code
        if(document.getElementById("fullyInsured" + "Box").checked) {visibilityObject.fullyInsured = "fi";}
        if(document.getElementById("selfInsured" + "Box").checked) {visibilityObject.selfInsured = "sf";}
        if(document.getElementById("medical" + "Box").checked) {visibilityObject.medical = "m";}
        if(document.getElementById("dental" + "Box").checked) {visibilityObject.dental = "d";}
        if(document.getElementById("vision" + "Box").checked) {visibilityObject.vision = "v";}
        if(document.getElementById("rx" + "Box").checked) {visibilityObject.rx = "rx";}
        if(document.getElementById("rxClaims" + "Box").checked) {visibilityObject.rxClaims = "rxc";}
        if(document.getElementById("rxClaimsInd" + "Box").checked) {visibilityObject.rxClaimsInd = "rxci";}
        if(document.getElementById("rxClaimsSm" + "Box").checked) {visibilityObject.rxClaimsSm = "rxsg";}
        if(document.getElementById("rxClaimsLg" + "Box").checked) {visibilityObject.rxClaimsLg = "rxg";}
        if(document.getElementById("hmo" + "Box").checked) {visibilityObject.hmo = "hmo";}
        if(document.getElementById("pos" + "Box").checked) {visibilityObject.pos = "pos";}
        if(document.getElementById("ppo" + "Box").checked) {visibilityObject.ppo = "ppo";}
        if(document.getElementById("pho" + "Box").checked) {visibilityObject.pho = "pho";}
        if(document.getElementById("posPlus" + "Box").checked) {visibilityObject.posPlus = "posp";}
        if(document.getElementById("posPlusSEH" + "Box").checked) {visibilityObject.posPlusSEH = "seh";}
        if(document.getElementById("ucciDental" + "Box").checked) {visibilityObject.ucciDental = "ud";}
        if(document.getElementById("blueDental" + "Box").checked) {visibilityObject.blueDental = "bd";}
        if(document.getElementById("hsa" + "Box").checked) {visibilityObject.hsa = "hsa";}
        if(document.getElementById("enrollHSA" + "Box").checked) {visibilityObject.enrollHSA = "ehsa";}
        if(document.getElementById("fsa" + "Box").checked) {visibilityObject.fsa = "fsa";}
        if(document.getElementById("hra" + "Box").checked) {visibilityObject.hra = "hra";}
        if(document.getElementById("dca" + "Box").checked) {visibilityObject.dca = "dca";}
        if(document.getElementById("multiplan" + "Box").checked) {visibilityObject.multiplan = "mp";}
        if(document.getElementById("idTheft" + "Box").checked) {visibilityObject.idTheft = "idt";}
        if(document.getElementById("cce" + "Box").checked) {visibilityObject.cce = "cce";}
        if(document.getElementById("hcr" + "Box").checked) {visibilityObject.hcr = "hcr";}
        if(document.getElementById("telemedicine" + "Box").checked) {visibilityObject.telemedicine = "tmd";}
        if(document.getElementById("reward" + "Box").checked) {visibilityObject.reward = "rwd";}
        if(document.getElementById("challenge" + "Box").checked) {visibilityObject.challenge = "chl";}
        if(document.getElementById("wellnessCore" + "Box").checked) {visibilityObject.wellnessCore = "wco";}
        if(document.getElementById("individual" + "Box").checked) {visibilityObject.individual = "ind";}
        if(document.getElementById("smallGroup" + "Box").checked) {visibilityObject.smallGroup = "sg";}
        if(document.getElementById("largeGroup" + "Box").checked) {visibilityObject.largeGroup = "lg";}
        if(document.getElementById("directPay" + "Box").checked) {visibilityObject.directPay = "dp";}
        if(document.getElementById("blueExtraBasic" + "Box").checked) {visibilityObject.blueExtraBasic = "beb";}
        if(document.getElementById("blueExtraPlus" + "Box").checked) {visibilityObject.blueExtraPlus = "bep";}
        if(document.getElementById("medicare" + "Box").checked) {visibilityObject.medicare = "mc";}
        if(document.getElementById("mediGap" + "Box").checked) {visibilityObject.mediGap = "mg";}
        if(document.getElementById("subscriber" + "Box").checked) {visibilityObject.subscriber = "sub";}
        if(document.getElementById("spouse" + "Box").checked) {visibilityObject.spouse = "sps";}
        if(document.getElementById("spouse_dep" + "Box").checked) {visibilityObject.spouse_dep = "dep1";}
        if(document.getElementById("dept" + "Box").checked) {visibilityObject.dept = "dep2";}
        if(document.getElementById("preEffectuated" + "Box").checked) {visibilityObject.preEffectuated = "pe";}
        if(document.getElementById("future" + "Box").checked) {visibilityObject.future = "fut";}
        if(document.getElementById("active" + "Box").checked) {visibilityObject.active = "act";}
        if(document.getElementById("termed" + "Box").checked) {visibilityObject.termed = "term";}
        if(document.getElementById("demo" + "Box").checked) {visibilityObject.demo = "dem";}
        if(document.getElementById("windowsDesktop" + "Box").checked) {visibilityObject.windowsDesktop = "wdw";}
        if(document.getElementById("macDesktop" + "Box").checked) {visibilityObject.macDesktop = "mdw";}
        if(document.getElementById("androidDesktop" + "Box").checked) {visibilityObject.androidDesktop = "atdw";}
        if(document.getElementById("ipadDesktop" + "Box").checked) {visibilityObject.ipadDesktop = "itdw";}
        if(document.getElementById("androidTablet" + "Box").checked) {visibilityObject.androidTablet = "atn";}
        if(document.getElementById("ipadTablet" + "Box").checked) {visibilityObject.ipadTablet = "itn";}
        if(document.getElementById("windowsTablet" + "Box").checked) {visibilityObject.windowsTablet = "wtn";}
        if(document.getElementById("androidPhone" + "Box").checked) {visibilityObject.androidPhone = "apn";}
        if(document.getElementById("iosPhone" + "Box").checked) {visibilityObject.iosPhone = "ipn";}
        if(document.getElementById("androidMobile" + "Box").checked) {visibilityObject.androidMobile = "aps";}
        if(document.getElementById("iosMobile" + "Box").checked) {visibilityObject.iosMobile = "ips";}
        if(document.getElementById("windowsMobile" + "Box").checked) {visibilityObject.windowsMobile = "wps";}
        if(document.getElementById("DEV" + "Box").checked) {visibilityObject.DEV = "d";}
        if(document.getElementById("QA" + "Box").checked) {visibilityObject.QA = "q";}
        if(document.getElementById("PROD" + "Box").checked) {visibilityObject.PROD = "p";}
        // 62 total visibility settings - need to parse into groups for unoptimized / optimized processing
        var groupa = [];
        var groupb = [];
        var groupc = [];
        var platform = [];
        var region = [];
        var groupaString = "";
        var groupbString = "";
        var groupcString = "";
        var platformString = "";
        var regionString = "";
        // assign the mnemonic categories to each specific group
        dataTransfer.returnRegexObject(visibilityObject, groupa, groupb, groupc, platform, region);
        // check each group length and generate appropriate string
        if(groupa.length == 0){
            groupaString = "";
        } else {
            for(var i = 0; i < groupa.length; i++){
                groupaString = groupaString + groupa[i] + "|";
            }
                groupaString = groupaString.slice(0, -1);
        }        
        if(groupb.length == 0){
            groupbString = "";
        } else {
            for(var i = 0; i < groupb.length; i++){
                groupbString = groupbString + groupb[i] + "|";
            }
                groupbString = groupbString.slice(0, -1);
        }
        if(groupc.length == 0){
            groupcString = "";
        } else {
            for(var i = 0; i < groupc.length; i++){
                groupcString = groupcString + groupc[i] + "|";
            }
                groupcString = groupcString.slice(0, -1);
        }
        if(platform.length == 0){
            platformString = "";
        } else {
            for(var i = 0; i < platform.length; i++){
                platformString = platformString + platform[i] + "|";
            }
            platformString = platformString.slice(0, -1);
        }
        if(region.length == 0){
            regionString = "";
        } else {
            for(var i = 0; i < region.length; i++){
                regionString = regionString + region[i] + "|"; 
            }
            regionString = regionString.slice(0, -1);
        }        
        $scope.unoptimized = "^.*~(" + groupaString + ")~.*_.*~(" + groupbString + ")~.*_.*~(" + groupcString + ")~.*\\-(" + platformString + ")_(" + regionString + ")$";
        // need to check if the override is enabled, conditional, or disabled, create appropriate strings for each
         if($("input[name='override']:checked").val() === "enabled"){
             console.log("Enabled String Generation");
             if(platform.length == 12 && region.length == 3){
                 $scope.optimized = "^.*$";
             } else if(platform.length < 12 && region.length == 3){
                 $scope.optimized = "^(.*)\\-(" + platformString + ")_.*$";
             } else if(platform.length == 12 && region.length < 3){
                 $scope.optimized = "^(.*)\\-.*_(" + regionString + ")$";
             } else {
                 $scope.optimized = "^(.*)\\-(" + platformString + ")_(" + regionString + ")$";
             }
         }else if($("input[name='override']:checked").val() === "conditional"){
             console.log("Conditional String Generation");
            // debug if IN THE EVENT THAT SOMEONE MESSES UP AND DOESN'T FOLLOW RULES
             if(groupa.length == 35){
                 groupaString = ".*"; // _.* designated a new group to match with all
             } else {
                 groupaString = ".*~(" + groupaString + ")~.*"; // ~()~ matches a specific set of characters
             }
             if(groupb.length == 8){
                 groupbString = "_.*"; //
             } else {
                 groupbString = "_.*~(" + groupbString + ")~.*";
             }
             if(groupc.length == 5){
                 groupcString = "_.*)"; 
             } else {
                 groupcString = "_.*~(" + groupcString + ")~.*)";
             }
             if(platform.length == 12 && region.length == 3){ // if the strings are maxed
                 platformString = "\\-.*$";
             } else if(platform.length < 12 && region.length == 3){ // if platform is less
                 platformString = "\\-(" + platformString + ")_.*$";
             } else if(platform.length == 12 && region.length < 3){ // if region is less
                 platformString = "\\-.*_(" + regionString + ")$";
             } else {
                 platformString = "\\-(" + platformString + ")_(" + regionString + ")$"; // if both are less
             }
             if(groupa.length == 35 && groupb.length == 8 && groupc.length == 5 && platform.length == 12 && region.length == 3){ // if everything maxes
                 $scope.optimized = "^.*$"; // match all
             } else if(groupa.length == 35 && groupb.length == 8 && groupc.length == 5 && (platform.length != 12 || region.length != 3 )){ // if just a, b, and c maxes
                 $scope.optimized = "^(.*)" + platformString; // match all groups except platform
             } else { // else everything isn't maxed
                 $scope.optimized = "^(" + groupaString + groupbString + groupcString + platformString;
             }                 
         }else if($("input[name='override']:checked").val() === "disabled"){
             console.log("Disabled String Generation");
             $scope.optimized = "^$"; // nothing matches if its disabled
         }            
        console.log("Unoptimized:", $scope.unoptimized);
        console.log("Optimized:", $scope.optimized);
        $scope.currentMnemonic.pattern = $scope.optimized;
        $scope.currentMnemonic.regex = $scope.unoptimized;
        dataTransfer.setTime($scope.currentMnemonic); // set the time
            // then push the new package locally
            dataTransfer.checkCopy({
                action: "Modify",
                sub: "Visibilities",
                id: package,
                name: $scope.currentMnemonic.keywordName,
                category: $scope.currentMnemonic.usage,
                desc: $scope.currentMnemonic.display,
                time: $scope.currentMnemonic.time,
                url: "mnemonicInfo",
                pattern: $scope.currentMnemonic.pattern,
                regex: $scope.currentMnemonic.regex,
                object: $scope.currentMnemonic
            });
            $scope.visibilityObjects.push($scope.currentMnemonic); // need to push to local visibility list
            $('#editVisibilityModal').modal('toggle'); // toggle the model
    };

    // function that loads the mnemonic data into modals 
    $scope.loadModifyData = function() {
        // this is where we will load the data in for the field from api call
        document.getElementById('mnemonicNameField').placeholder = $scope.currentMnemonic.keywordName;
        document.getElementById('mnemonicCategoryField').placeholder = $scope.currentMnemonic.usage;
        document.getElementById('mnemonicNavigableField').placeholder = $scope.currentMnemonic.navigable;
        document.getElementById('mnemonicCapabilityField').placeholder = $scope.currentMnemonic.cap;
        document.getElementById('mnemonicMobileField').placeholder = $scope.currentMnemonic.mobile;
        document.getElementById('mnemonicDisplayField').placeholder = $scope.currentMnemonic.display;
        document.getElementById('mnemonicURLField').placeholder = $scope.currentMnemonic.url;
        document.getElementById('mnemonicNavigationField').placeholder = $scope.currentMnemonic.loc;
        document.getElementById('mnemonicRelatedField').value = $scope.currentMnemonic.relatedMnemonics;
    };
    // function that is called when we make modified changes
    $scope.modifyModal = function() {
        // need to check what checkbox changes the user wants to submit for changes
        if(document.getElementById('modifyMnemonicNameCheck').checked === true) {
            $scope.modify_keyword_name = document.getElementById('mnemonicNameField').value;
            if(document.getElementById("mnemonicNameField").value === "") { // each mnemonic name must be unique
                alert("Mnemonic Name Cannot Be Empty!");
                return;
            }
        }
        if(document.getElementById('modifyMnemonicCateCheck').checked === true) {
            $scope.modify_keyword_cate = document.getElementById('mnemonicCategoryField').value;
        }
        if(document.getElementById('modifyMnemonicNaviCheck').checked === true) {
            $scope.modify_keyword_navi = document.getElementById('mnemonicNavigableField').value;

        }
        if(document.getElementById('modifyMnemonicCapCheck').checked === true) {
            $scope.modify_keyword_cap = document.getElemenyById('mnemonicCapabilityField').value;

        }
        if(document.getElementById('modifyMnemonicMobileCheck').checked === true) {
            $scope.modify_keyword_mobile = document.getElementById('mnemonicMobileField').value;

        }
        if(document.getElementById('modifyMnemonicDisplayCheck').checked === true) {
            $scope.modify_keyword_dis = document.getElementById('mnemonicDisplayField').value;
            if(document.getElementById("mnemonicDisplayField").value === "") {
                alert("Mnemonic Display Cannot Be Empty!");
                return;
            }
        }
        if(document.getElementById('modifyMnemonicURLCheck').checked === true) {
            $scope.modify_keyword_url = document.getElemenyById('mnemonicURLField').value;

        }
        if(document.getElementById('modifyMnemonicLocCheck').checked === true) {
            $scope.modify_keyword_loc = document.getElementById('mnemonicNavigationField').value;

        }
        if(document.getElementById('modifyMnemonicRelCheck').checked === true) {
            $scope.modify_keyword_rel = document.getElementById('mnemonicRelatedField').value;

        }
        $scope.currentMnemonic = {
            name: $scope.modify_keyword_name, usage: $scope.modify_keyword_cate,
            navigabile: $scope.modify_keyword_navi, capability: $scope.modify_keyword_cap,
            mobile: $scope.modify_keyword_mobile, display: $scope.modify_keyword_dis,
            url: $scope.modify_keyword_url, location: $scope.modify_keyword_loc, 
            related: $scope.modify_keyword_rel
        };        
        dataTransfer.setTime($scope.currentMnemonic);
        // push the list locally
        dataTransfer.checkCopy({
            action: "Modify",
            sub: "Mnemonic",
            id: $scope.name,
            name: $scope.name,
            category: $scope.currentMnemonic.category,
            desc: $scope.currentMnemonic.display,
            url: "mnemonicInfo",
            time: $scope.currentMnemonic.time,
            object: $scope.currentMnemonic
        });
        // toggle the model
        $('#modifyMnemonicModal').modal('toggle');
    };
    // function that's called when we delete a mnemonic
    $scope.deleteModal = function() {
        dataTransfer.setTime($scope.currentMnemonic);
        //    alert($scope.mnemonicEditList[i].name); // debug
        dataTransfer.checkCopy({
            action: "Delete",
            sub: "Mnemonic",
            id: $scope.name,
            name: $scope.name,
            category: $scope.currentMnemonic.usage,
            desc: $scope.currentMnemonic.display,
            url: "mnemonicInfo",
            time: $scope.currentMnemonic.time,
            object: $scope.currentMnemonic
        });
        $('#deleteMnemonicModal').modal('toggle'); // toggle the model
        $location.path("/"); // change the path to the dashboard
    };

    // function that is called when we want to assign a mnemonic to a package
    $scope.addPackage = function() {

        // need to get the list of packages that have a check
        // then populate the packages into an object array
        
        dataTransfer.setTime($scope.currentMnemonic);

        // then push the added mnemonic(s) locally by passing the object array

        dataTransfer.checkCopy({
            action: "Modify",
            sub: "Association",
            id: $scope.name,
            name: $scope.name,
            category: $scope.currentMnemonic.usage,
            desc: $scope.currentMnemonic.display,
            url: "mnemonicInfo",
            time: $scope.currentMnemonic.time,
            object: $scope.currentMnemonic
        });
        $('#editPackagesModal').modal('toggle'); // toggle the model
    };
    // function that is called when we want to search for packages
    $scope.searchPackages = function() {
        alert(document.getElementById('modalsearchBox').value);
    };
    // function that returns the visibility setting if it is active
    $scope.settings = function(index) {
        // check if the index is active in the visibility settings object
        if($scope.visibility[0][index] === null) {
            return "";
        } else {
            if($scope.visibility[0][index] === "active") {
                return index;
            }
        }
    };    
    // function that returns the global enabled state 
    $scope.global = function() {
        if($scope.visibility[0].global === "active") {
            return "Enabled";
        } else if($scope.visibility[0].global === "conditional") {
            return "Conditional";
        } else if($scope.visibility[0].global === "disabled") {
            return "Disabled";
        }
    };

});
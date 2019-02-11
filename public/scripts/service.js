configApp.service('dataTransfer',function() {
    // local variables for our service
    var date;
    var QAchangeList = [];
    var packageList = [];
    var mnemonicList = [];
    var historyList = [];
    var publishList = [];
    // getters, setters, and clearers for date object
    this.setDate = function() {
        date = new Date();
    };
    this.getDate = function() {
        return date.toUTCString();
    };
    this.clearDate = function() {
        date = "";
    };
    // getters and setters for QA changes locally
    this.setQA = function(x) {
        QAchangeList = x;
    };
    this.getQA = function() {
        return QAchangeList;
    };
    // getters and setters for local package list
    this.setPackage = function(x) {
        packageList = x;
    };
    this.getPackage = function() {
        return packageList;
    };
    // getters and setters for local mnemonic list
    this.setMnemonic = function(x) {
        mnemonicList = x;
    };
    this.getMnemonic = function() {
        return mnemonicList;
    };
    // getters and setters for local history index
    this.setHistoryIndex = function(x, y) {
        historyList[x] = {
            url: y
        };
    };
    this.getHistoryIndex = function(x) {
        return historyList[x];
    };
    // getters and setters for local history list
    this.setHistoryList = function(x) {
        historyList = x;
    };
    this.getHistoryList = function() {
        return historyList;
    };
    // getters and setters for local publish history list
    this.getPublish = function() {
        return publishList;
    };
    this.setPublish = function(x) {
        publishList = x;
    };
    // function that gets called everytime we make a change. This function is to avoid any duplicate changes / merge changes into one object
    this.checkCopy = function(change) {
        var changeList = this.getQA();
        if(changeList.length < 1) {
            changeList.push(change);
            console.log("Pushing New Change!");
        } else {
            for(var i = 0; i < changeList.length; i++) { // for each element in the changes list
                if(change.id === changeList[i].id) { // if the id is the same 
                    // cancel any chang`es by splicing both the value and the changelist for a create
                    if(changeList[i].action === "Create" && change.action === "Modify") {
                        changeList[i] = change;
                        changeList[i].action = "Create";
                    }
                    // cancel any changes and remove the index
                    else if(changeList[i].action === "Create" && change.action === "Delete") {
                        changeList.splice(changeList[i],1);
                    }
                    // straight up assignment after we check if its the original ajax information
                    else if(changeList[i].action === "Modify" && change.action === "Modify") {
                        if(changeList[i].originalObject === change.object) {
                                changeList.splice(changeList[i], 1);
                        } else {
                                changeList[i] = change;
                        }
                    }
                    // only keep the delete change
                    else if(changeList[i].action === "Modify" && change.action === "Delete") {
                        changeList[i] = change;
                    }
                    // cancel all objects and changes if the delete is same as create
                    else if(changeList[i].action === "Delete" && change.action === "Create") {
                        if(changeList[i].object === change.object) { // cancel all objects and changes if the delete is same as create
                                changeList.splice(changeList[i], 1);
                        } else { // else merge the action to a modify
                                changeList[i] = change;
                                changeList[i].action = "Modify";
                        }
                    }
                } else {
                    changeList.push(change);
                    console.log("Pushing New Change!");
                    break;
                }
            }
        }
        this.setQA(changeList);
        sessionStorage.setItem('qa', JSON.stringify(changeList)); 
        console.log(this.getQA());
    };	
    // function that sets the time for an object passed in as a parameter
    this.setTime = function(object) {
        this.setDate(); // set the change time;
        var time = this.getDate(); // get the time locally
        object.time = time;
        this.clearDate(); // clear the service data
    };
    // this function alerts the user that a local change is different than a QA change
    // on hold until publish is fixed
    this.mergeChange = function() {};
    // function that checks if the regex value is null, if it isn't, push the object to the group
    this.returnRegex = function(object,group) {
        if(object !== "") {
            group.push(object);
        }
    };
    // function that pushes the object into each individual group for optimiziation
    this.returnRegexObject = function(visibilityObject, groupa, groupb, groupc, platform, region) {
			this.returnRegex(visibilityObject.fullyInsured,groupa);
			this.returnRegex(visibilityObject.selfInsured,groupa);
			this.returnRegex(visibilityObject.medical,groupa);
			this.returnRegex(visibilityObject.dental,groupa);
			this.returnRegex(visibilityObject.vision,groupa);
			this.returnRegex(visibilityObject.rx,groupa);
			this.returnRegex(visibilityObject.rxClaims,groupa);
			this.returnRegex(visibilityObject.rxClaimsInd,groupa);
			this.returnRegex(visibilityObject.rxClaimsSm,groupa);
			this.returnRegex(visibilityObject.rxClaimsLg,groupa);
			this.returnRegex(visibilityObject.hmo,groupa);
			this.returnRegex(visibilityObject.pos,groupa);
			this.returnRegex(visibilityObject.ppo,groupa);
			this.returnRegex(visibilityObject.pho,groupa);
			this.returnRegex(visibilityObject.posPlus,groupa);
			this.returnRegex(visibilityObject.posPlusSEH,groupa);
			this.returnRegex(visibilityObject.ucciDental,groupa);
			this.returnRegex(visibilityObject.blueDental,groupa);
			this.returnRegex(visibilityObject.hsa,groupa);
			this.returnRegex(visibilityObject.enrollHSA,groupa);
			this.returnRegex(visibilityObject.fsa,groupa);
			this.returnRegex(visibilityObject.hra,groupa);
			this.returnRegex(visibilityObject.dca,groupa);
			this.returnRegex(visibilityObject.multiplan,groupa);
			this.returnRegex(visibilityObject.idTheft,groupa);
			this.returnRegex(visibilityObject.cce,groupa);
			this.returnRegex(visibilityObject.hcr,groupa);
			this.returnRegex(visibilityObject.telemedicine,groupa);
			this.returnRegex(visibilityObject.reward,groupa);
			this.returnRegex(visibilityObject.challenge,groupa);
			this.returnRegex(visibilityObject.wellnessCore,groupa);
			this.returnRegex(visibilityObject.individual,groupa);
			this.returnRegex(visibilityObject.smallGroup,groupa);
			this.returnRegex(visibilityObject.largeGroup,groupa);
			this.returnRegex(visibilityObject.directPay,groupa);
			this.returnRegex(visibilityObject.blueExtraBasic,groupb);
			this.returnRegex(visibilityObject.blueExtraPlus,groupb);
			this.returnRegex(visibilityObject.medicare,groupb);
			this.returnRegex(visibilityObject.mediGap,groupb);
			this.returnRegex(visibilityObject.subscriber,groupb);
			this.returnRegex(visibilityObject.spouse,groupb);
			this.returnRegex(visibilityObject.spouse_dep,groupb);
			this.returnRegex(visibilityObject.dept,groupb);
			this.returnRegex(visibilityObject.preEffectuated,groupc);
			this.returnRegex(visibilityObject.future,groupc);
			this.returnRegex(visibilityObject.active,groupc);
			this.returnRegex(visibilityObject.termed,groupc);
			this.returnRegex(visibilityObject.demo,groupc);
			this.returnRegex(visibilityObject.windowsDesktop,platform);
			this.returnRegex(visibilityObject.macDesktop,platform);
			this.returnRegex(visibilityObject.androidDesktop,platform);
			this.returnRegex(visibilityObject.ipadDesktop,platform);
			this.returnRegex(visibilityObject.androidTablet,platform);
			this.returnRegex(visibilityObject.ipadTablet,platform);
			this.returnRegex(visibilityObject.windowsTablet,platform);
			this.returnRegex(visibilityObject.androidPhone,platform);
			this.returnRegex(visibilityObject.iosPhone,platform);
			this.returnRegex(visibilityObject.androidMobile,platform);
			this.returnRegex(visibilityObject.iosMobile,platform);
			this.returnRegex(visibilityObject.windowsMobile,platform);
			this.returnRegex(visibilityObject.DEV,region);
			this.returnRegex(visibilityObject.QA,region);
			this.returnRegex(visibilityObject.PROD,region);
    };

    this.alertMerge = function(){
        if (confirm("A database change has been detected that is different than the original object in a local change.\n\nIf you want to merge your local changes with the updated database fields, click ok. If not, your local changes will be discarded.")) {
            alert("We shall merge changes.");
            // need to process changes by grabbing the lists
        } else {
            alert("We shalln't be merging changes - discard your instead.");
            // need to grab the list of local changes that conflicts with the data and remove it from QA()
            // var QAlist = dataTransfer.getQA();
            // var newChanges = localList;
            //for(var i = 0; i < localList.length; i++){
            //    var index = localList.indexOf(currentPackage.id);
            //    this has to be the QA list
            //    newChanges.splice(index, 1);
            //} 
            // dataTransfer.setQA(newChanges);
            
        }  
    };

});
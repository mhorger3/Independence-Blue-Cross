configApp.controller('keywordViewController', function($scope, $location, dataTransfer) {
    $(window).on("unload", function(e) {
        console.log("store local lists into storage");
        sessionStorage.setItem('keywords', JSON.stringify($scope.mnemonics));
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
        
        $.ajax({
           type: 'POST',
           url: "http://paea0003:4567/api/mnemonics",
           processData: true,
           crossDomain: true,
           data: json,
           dataType: "json",
           success: function (data) {
               $scope.$apply(function(){
               $scope.mnemonics = data.data;
               $scope.decodeAdditionalInfo($scope.mnemonics);
            }); 
            
           var table = $('#keywordList').DataTable({
                lengthChange: false,
                pageLength: 5
            }); // initialize our datatable
            $('#loading').hide();
            $('#searchKeywords').on( 'keyup', function () {
                table.search( this.value ).draw();
            }); 
            
            
           }
        });
        
        
           // var local = sessionStorage.getItem('keywords');
           // var result = jQuery.parseJSON(local);
           // if(result === null) { // if we can't get local changes, we should't call the api
           //     dataTransfer.setMnemonic([]);
           // } else {
           //     dataTransfer.setMnemonic(result);
          //  }
        
        // need to merge any local changes
     //   mergeByProperty($scope.mnemonics, result, 'name');

      //  console.log($scope.mnemonics);


    });

    // function declarations

    // function that checks all the given checkboxes in the datatable
    $('#checkbox_all').change(function() {
        $('tbody tr td input[type="checkbox"]').prop('checked', $(this).prop('checked'));
        // needs to load them into the modify set
        console.log($scope.mnemonics.length);
        angular.forEach($scope.mnemonics, function(value, key) {
            console.log(JSON.stringify(value.keywordName));
            $scope.getCheckData(value.keywordName);
        });
    });
    
    
    function mergeByProperty(arr1, arr2, prop) {
            _.each(arr2, function(arr2obj) {
            var arr1obj = _.find(arr1, function(arr1obj) {
                return arr1obj[prop] === arr2obj[prop];
            });
         
            //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
            arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
            });
    };

    //function that gets the data on the selected row of the checkbox           
    $scope.getCheckData = function(name) {
        if((document.getElementById('checkbox-' + name)).checked) {
            // we need to call the api for each sub-field of the mnemonic
            for(var i = 0; i < $scope.mnemonics.length; i++) {
                if($scope.mnemonics[i].keywordName == name) {
                    $scope.mnemonicEditList.push({ // push the mnemonic to the list if its checked
                        name: $scope.mnemonics[i].keywordName,
                        cate: $scope.mnemonics[i].usage,
                        navi: $scope.mnemonics[i].navigable,
                        cap:$scope.mnemonics[i].actionName,
                        mobile: $scope.mnemonics[i].mobile,
                        dis: $scope.mnemonics[i].display,
                        url: $scope.mnemonics[i].urlText,
                        loc: $scope.mnemonics[i].usage,
                        rel: $scope.mnemonics[i].relatedMnemonics
                });
                }
            }

            if($scope.mnemonicEditList.length !== 0) {
                document.getElementById('modifyButton').disabled = false;
                document.getElementById('deleteButton').disabled = false;
            } else {
                document.getElementById('modifyButton').disabled = true;
                document.getElementById('deleteButton').disabled = true;
            }
        } else {
            if($scope.mnemonicEditList.length <= 1) {
                $scope.mnemonicEditList = [];
            } else {
                var index = $scope.mnemonicEditList.indexOf(currentMnemonic.name);
                $scope.mnemonicEditList.splice(index, 1);
            }

            if($scope.mnemonicEditList.length !== 0) {
                document.getElementById('modifyButton').disabled = false;
                document.getElementById('deleteButton').disabled = false;
            } else {
                document.getElementById('modifyButton').disabled = true;
                document.getElementById('deleteButton').disabled = true;
            }
        }
    };

    // function that loads the selected data from the edit list into our modify view
    $scope.loadModifyData = function() {
        // if only one item is in the list
        if($scope.mnemonicEditList.length <= 1) {
            document.getElementById('mnemonicNameField').placeholder = $scope.mnemonicEditList[0].name;
            document.getElementById('mnemonicCategoryField').placeholder = $scope.mnemonicEditList[0].cate;
            document.getElementById('mnemonicNavigableField').placeholder = $scope.mnemonicEditList[0].navi;
            document.getElementById('mnemonicCapabilityField').placeholder = $scope.mnemonicEditList[0].cap;
            document.getElementById('mnemonicMobileField').placeholder = $scope.mnemonicEditList[0].mobile;
            document.getElementById('mnemonicDisplayField').placeholder = $scope.mnemonicEditList[0].dis;
            document.getElementById('mnemonicURLField').placeholder = $scope.mnemonicEditList[0].url;
            document.getElementById('mnemonicNavigationField').placeholder = $scope.mnemonicEditList[0].loc;
            document.getElementById('mnemonicRelatedField').value = $scope.mnemonicEditList[0].rel;
        } else {
            // else display mixed
            document.getElementById('mnemonicNameField').placeholder = "mixed";
            document.getElementById('mnemonicCategoryField').placeholder = "mixed";
            document.getElementById('mnemonicNavigableField').placeholder = "mixed";
            document.getElementById('mnemonicCapabilityField').placeholder = "mixed";
            document.getElementById('mnemonicMobileField').placeholder = "mixed";
            document.getElementById('mnemonicDisplayField').placeholder = "mixed";
            document.getElementById('mnemonicURLField').placeholder = "mixed";
            document.getElementById('mnemonicNavigationField').placeholder = "mixed";
            document.getElementById('mnemonicRelatedField').placeholder = "mixed";
        }

        if(document.getElementById('mnemonicNameField').placeholder === "mixed") {
            document.getElementById('modifyMnemonicNameCheck').disabled = true;
            document.getElementById('mnemonicNameField').disabled = true;
        } else {
            document.getElementById('modifyMnemonicNameCheck').disabled = false;
            document.getElementById('mnemonicNameField').disabled = false;
        }
    };

    // function that gets called when we create a mnemonic
    $scope.createModal = function() {
        if(document.getElementById("mnemonicName").value === "") { // every mnemonic needs a display and a name
            alert("Mnemonic Name Cannot Be Empty!");
        } else if(document.getElementById("mnemonicDisplay").value === "") {
            alert("Mnemonic Display Text Cannot Be Empty!");
        } else {
            var mnemonic = {
                name: $scope.create_keyword_name,
                cate: $scope.create_keyword_cate,
                navi: $scope.create_keyword_navi,
                cap: $scope.create_keyword_cap,
                mobile: $scope.create_keyword_mobile,
                dis: $scope.create_keyword_display,
                url: $scope.create_keyword_url,
                loc: $scope.create_keyword_loc,
                rel: $scope.create_keyword_rel
            };


           // check if the mnemonic version id is unique in the recordset - api call

            dataTransfer.setTime(mnemonic);

            // then push the new mnemonic locally
            dataTransfer.checkCopy({
                action: "Create",
                sub: "Mnemonic",
                id: mnemonic.name,
                name: mnemonic.name,
                category: mnemonic.cate,
                desc: mnemonic.dis,
                url: "mnemonicInfo",
                time: mnemonic.time,
                object: mnemonic
            });

            $scope.mnemonics.push(mnemonic);
            
            // toggle the model
            $('#createMnemonicModal').modal('toggle');
        }
    };

        // function that gets called when we delete a mnemonic
    $scope.deleteModal = function() {
      
        // then push the deleted mnemonic(s) locally
        for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
            
            dataTransfer.setTime($scope.mnemonicEditList[i]);
            
            dataTransfer.checkCopy({
                action: "Delete",
                sub: "Mnemonic",
                id: "",
                name: $scope.mnemonicEditList[i].name,
                category: $scope.mnemonicEditList[i].cate,
                desc: $scope.mnemonicEditList[i].dis,
                url: "",
                time: $scope.mnemonicEditList[i].time,
                object: $scope.mnemonicEditList[i]
            });
        }

        $('#deleteMnemonicModal').modal('toggle'); // toggle the model
        $location.path("/");
    };

    // function that gets called when we modify a mnemonic
    $scope.modifyModal = function() {

        // need to check what checkbox changes the user wants to submit for changes
        if(document.getElementById('modifyMnemonicNameCheck').checked === true) {
            $scope.modify_keyword_name = document.getElementById('mnemonicNameField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) { // for each mnemonic in the list - could be multiple
                $scope.mnemonicEditList[i].name = $scope.modify_keyword_name;
            }
            if($scope.mnemonicEditList.length < 2) {
                if(document.getElementById("mnemonicNameField").value === "") {
                    alert("Mnemonic Name Cannot Be Empty!");
                    document.getElementById("mnemonicNameField").style.borderColor = "red";
                    return;
                }
            }
        }
        if(document.getElementById('modifyMnemonicCateCheck').checked === true) {
            $scope.modify_keyword_cate = document.getElementById('mnemonicCategoryField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].cate = $scope.modify_keyword_cate;
            }
        }
        if(document.getElementById('modifyMnemonicNaviCheck').checked === true) {
            $scope.modify_keyword_navi = document.getElementById('mnemonicNavigableField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].navi = $scope.modify_keyword_navi;
            }
        }
        if(document.getElementById('modifyMnemonicCapCheck').checked === true) {
            $scope.modify_keyword_cap = document.getElementById('mnemonicCapabilityField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].cap = $scope.modify_keyword_cap;
            }
        }
        if(document.getElementById('modifyMnemonicMobileCheck').checked === true) {
            $scope.modify_keyword_mobile = document.getElementById('mnemonicMobileField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].mobile = $scope.modify_keyword_mobile;
            }
        }
        if(document.getElementById('modifyMnemonicDisplayCheck').checked === true) {
            $scope.modify_keyword_dis = document.getElementById('mnemonicDisplayField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].dis = $scope.modify_keyword_dis;
            }
            if(document.getElementById("mnemonicDisplayField").value === "") {
                alert("Mnemonic Display Text Cannot Be Empty!");
                return;
            }
        }
        if(document.getElementById('modifyMnemonicURLCheck').checked === true) {
            $scope.modify_keyword_url = document.getElementById('mnemonicURLField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].url = $scope.modify_keyword_url;
            }
        }
        if(document.getElementById('modifyMnemonicLocCheck').checked === true) {
            $scope.modify_keyword_loc = document.getElementById('mnemonicNavigationField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].loc = $scope.modify_keyword_loc;
            }
        }
        if(document.getElementById('modifyMnemonicRelCheck').checked === true) {
            $scope.modify_keyword_rel = document.getElementById('mnemonicRelatedField').value;
            for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
                $scope.mnemonicEditList[i].rel = $scope.modify_keyword_rel;
            }
        }
        // push the list locally
        for(var i = 0; i < $scope.mnemonicEditList.length; i++) {
            dataTransfer.setTime($scope.mnemonicEditList[i]);
            
            var mnemonic = {
                name: $scope.mnemonicEditList[i].name,
                cate: $scope.mnemonicEditList[i].cate,
                navi: $scope.mnemonicEditList[i].navi,
                cap: $scope.mnemonicEditList[i].cap,
                mobile: $scope.mnemonicEditList[i].mobile,
                dis: $scope.mnemonicEditList[i].display,
                url: $scope.mnemonicEditList[i].url,
                loc: $scope.mnemonicEditList[i].loc,
                rel: $scope.mnemonicEditList[i].rel,
                time: $scope.mnemonicEditList[i].time
            };
            
            dataTransfer.checkCopy({
                action: "Modify",
                sub: "Keyword",
                id: "",
                name: $scope.mnemonicEditList[i].name,
                category: $scope.mnemonicEditList[i].cate,
                desc: $scope.mnemonicEditList[i].dis,
                url: "mnemonicInfo",
                time: $scope.mnemonicEditList[i].time,
                object: mnemonic
            });
            
            $scope.mnemonics.push(mnemonic);
        }
          
        // toggle the model
        $('#modifyMnemonicModal').modal('toggle');

    };
    // function that encodes the additional info
    $scope.encodeAdditionalInfo = function(string) {
        var localObject = {
            mobileDisplayText: $scope.mobile,
            usage: $scope.usage,
            navigable: $scope.navigable
        };
        return JSON.stringify(localObject);
    };

    // function that decodes the additional info
    $scope.decodeAdditionalInfo = function(list) {
        for(var i = 0; i < list.length; i++) {
            var string = list[i].additionalInfoText;
            if(string.substr(0, 1) === "{") {
                var local = JSON.parse(string);
                list[i].mobile = local.mobileDisplayText;
                list[i].usage = local.usage;
                list[i].navigable = local.navigable;
            } else {
                list[i].mobile = "";
                list[i].usage = "";
                list[i].navigable = "";
            }
        }
    };

    
    // local mnemonic struct  
    var currentMnemonic = {
        name: "",
        cate: "",
        navi: "",
        cap: "",
        mobile: "",
        dis: "",
        url: "",
        loc: "",
        rel: ""
    };

    // local edit list
    $scope.mnemonicEditList = [];

});
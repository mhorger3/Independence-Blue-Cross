configApp.controller('packageInfoController', function($scope, $routeParams, $location, dataTransfer) {

    // the model is unique for each package
    $scope.model = {
        id: $routeParams.id // and each route param is the unique id
    };

    // this is where we can set the name based off of id
    $scope.id = $routeParams.id;

    $(window).on("unload", function() {
        console.log("store local lists into storage");
        sessionStorage.setItem('package', JSON.stringify($scope.packages));
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
        var term = $scope.id;
        var url = "http://paea0003:4567/api/packages/" + term + "/get";
        var data0 = {"amount": -1};
        var json = JSON.stringify(data0);
        
        
        // ajax call that gets the package information for the given id
            $.ajax({
               type: 'POST',
               url: url,
               processData: true,
               crossDomain: true,
               data: {},
               dataType: "json",
               success: function (data) {
                   $scope.$apply(function(){
                        $scope.currentPackage = data.data[0];
                        $scope.decodeAdditionalInfo($scope.currentPackage.description);
                        console.log($scope.currentPackage);
                });
               }
        });
        
        
        // ajax call for all mnemonics
            $.ajax({
               type: 'POST',
               url: "http://paea0003:4567/api/mnemonics",
               processData: true,
               crossDomain: true,
               data: json,
               dataType: "json",
               success: function (data) {
                    $scope.$apply(function(){
                        $scope.Allmnemonics = data.data;
                        console.log($scope.Allmnemonics);
                                  
                    });
                        $('#enabled_mnemonics_modal').DataTable({
                        lengthChange: false,
                        pageLength: 5
                        });
               }
            });
            
                
        // ajax call for all mnemonics
            $.ajax({
               type: 'POST',
               url: "http://paea0003:4567/api/packages/" + $scope.id + "/settings",
               processData: true,
               crossDomain: true,
               data: json,
               dataType: "json",
               success: function (data) {
                    $scope.$apply(function(){
                        console.log(data);
                        $scope.mnemonics = data.data;   
                    });
                        var table = $('#enabledMnemonics').DataTable({
                        lengthChange: false,
                        pageLength: 6
                        }); // initialize data tables
                        $('#loading').hide();
                        $('#searchMnemonics').on( 'keyup', function () {
                        table.search( this.value ).draw();
                        });
               }
            });
            
});

    // declare functions

    // function that decodes the string of text we get from the db        
    $scope.decodeAdditionalInfo = function(string) {
        // if the first character is a curly brace, we know its json
        if(string.substr(0, 1) === "{") {
            var local = jQuery.parseJSON(string);
            $scope.description = local.description;
            $scope.usage = local.usage;
        } else {
            $scope.description = string;
            $scope.usage = "";
        }
            $scope.currentPackage.description = $scope.description;
            $scope.currentPackage.usage = $scope.usage;

    };

    // function that encodes the json object to a string for the db  
    $scope.encodeAdditionalInfo = function() {
        var localObject = {
            description: $scope.description,
            usage: $scope.usage
        };
        return JSON.stringify(localObject);
    };


    
    // function that decodes the description and usage from the database            
    $scope.decodeAllPackageAdditionalInfo = function() {
        for(var i = 0; i < $scope.Allpackages.length; i++) {
            var string = $scope.Allpackages[i].description;
            if(string.substr(0, 1) === "{") {
                var local = JSON.parse(string);
                $scope.Allpackages[i].description = local.description;
                $scope.Allpackages[i].usage = local.usage;
            } else {
                $scope.Allpackages[i].description = string;
                $scope.Allpackages[i].usage = "";
            }
        }
    };

    // function that encodes the description and usage for the json database
    $scope.encodeAllPackageAdditionalInfo = function() {
        for(var i = 0; i < $scope.Allpackages.length; i++) { // for every item in the package list
            var localObject = {
                description: $scope.description,
                usage: $scope.usage
            };
            // set the description equal to the helper function result (returns a string)
            $scope.Allpackages[i].description = $scope.escapeSpecialChar(JSON.stringify(localObject));
        }

    };

    // function that checks all the given checkboxes in the datatable  
    $('#checkbox_all').change(function() {
        $('tbody tr td input[type="checkbox"]').prop('checked', $(this).prop('checked'));
        // needs to load them into the modify set
        console.log($scope.fullMnemonics.length);
        angular.forEach($scope.fullMnemonics, function(value, key) {
            console.log(JSON.stringify(value.name));
            $scope.getCheckData(value.name);
        });
    });

    // function used for check data
    $scope.getCheckData = function(name) {
        if((document.getElementById('checkbox-' + name)).checked) {
            // need to get the mnemonic from the api
            var currentMnemonic = {
                name: name
            };
            $scope.addMnemonicList.push(currentMnemonic);

        } else { // if someone unchecks 
            // use filter to find the package using the id and get it out of the array by returning everything but it
            if($scope.addMnemonicList.length <= 1) {
                $scope.addMnemonicList = [];
                //    alert($scope.packageEditList.length); debug purposes
            } else {

                var index = $scope.addMnemonicList.indexOf(currentMnemonic.name);
                $scope.addMnemonicList.splice(index, 1);
            }
        }
    };

    // function that gets called whenever we click on a modify or delete button
    $scope.loadModifyData = function() {

        //  this is where we will load our data from an api call
        document.getElementById('packageIDfield').placeholder = $scope.id;
        document.getElementById('packageNamefield').placeholder = "testName";
        document.getElementById('packageDescriptionfield').placeholder = "testDesc";
        document.getElementById('selectPackageBase').value = "testBase";
        document.getElementById('selectPackageCate').value = "testCate";

    };

    // function that gets called when we modify a package
    $scope.modifyModal = function() {

        // need to check what checkbox changes the user wants to submit for changes
        if(document.getElementById('modifyPackageNameCheck').checked === true) {
            $scope.modify_package_name = document.getElementById('packageNamefield').value;
            if(document.getElementById("packageNamefield").value === "") { // check if field is empty
                alert("Package Name Cannot Be Empty!");
                document.getElementById("packageNamefield").style.borderColor = "red";
                return;
            }
        }
        if(document.getElementById('modifyPackageIDCheck').checked === true) {
            $scope.modify_package_id = document.getElementById('packageIDfield').value;
            if(document.getElementById("packageIDfield").value === "") {
                alert("Package ID Cannot Be Empty!");
                document.getElementById("packageIDfield").style.borderColor = "red";
                return;
            }
        }
        if(document.getElementById('modifyPackageDescCheck').checked === true) {
            $scope.modify_package_desc = document.getElementById('packageDescriptionfield').value;
        }
        if(document.getElementById('modifyPackageBaseCheck').checked === true) {
            var box = document.getElementById('selectPackageBase');
            $scope.modify_package_base = box.options[box.selectedIndex].text;
        }
        if(document.getElementById('modifyPackageCateCheck').checked === true) {
            var box = document.getElementById('selectPackageCate');
            $scope.modify_package_cate = box.options[box.selectedIndex].text;
        }

        dataTransfer.setTime($scope.currentPackage);

        dataTransfer.checkCopy({
            action: "Modify",
            sub: "Package",
            id: $scope.modify_package_id,
            name: $scope.modify_package_name,
            category: $scope.modify_package_cate,
            desc: "",
            url: "packageInfo",
            time: $scope.currentPackage.time
        });
        $('#modifyPackageModal').modal('toggle'); // toggle the model

    };

    // function that gets called when we delete a package
    $scope.deleteModal = function() {

        dataTransfer.setTime($scope.currentPackage);
        dataTransfer.checkCopy({
            action: "Delete",
            sub: "Package",
            id: "package_id",
            name: $scope.name,
            category: "",
            desc: "",
            url: "",
            time: $scope.currentPackage.time
        });
        $('#deletePackageModal').modal('toggle'); // toggle the model
        // redirect to dashboard and reload the page
        $location.path("/");
    };

    // function that gets called when we assign a mnemonic to a package
    $scope.addMnemonic = function() {

        // need to get the list of mnemonics that have a check
        // 
        // then populate the mnemonics into an object array


        dataTransfer.setTime($scope.currentPackage);
        // then push the added mnemonic(s) locally by passing the object array

        dataTransfer.checkCopy({
            action: "Modify",
            sub: "Association",
            id: "package_id",
            name: $scope.name,
            category: "",
            desc: "",
            url: "",
            time: $scope.currentPackage.time
        });
        $('#editMnemonicsModal').modal('toggle'); // toggle the model
    };

    // function that gets called when we search for a mnemonic in a package
    $scope.searchMnemonics = function() {
        alert(document.getElementById('searchMnemonic').value);
        $scope.searchTerm = document.getElementById('searchMnemonic').value; // store it into the scope
        $scope.dirtyFlag = true;
        location.reload();

    };
    
    // this will be the list of usage categories 
    $scope.categories = [{
        name: "Health and Wellness"
    }, {
        name: "NextGen"
    }];

    // local variable for search keyword
    $scope.searchKeyword = '';

   

    $scope.addMnemonicList = [];

});
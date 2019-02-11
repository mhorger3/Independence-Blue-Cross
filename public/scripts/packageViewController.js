configApp.controller('packageViewController', function($scope, $location, dataTransfer) {

    $(window).on("unload", function(e) {
        console.log("store local lists into storage");
        sessionStorage.setItem('packages', JSON.stringify($scope.packages));
        sessionStorage.setItem('qa', JSON.stringify(dataTransfer.getQA())); // stores the lists into sessionstorage on page reload
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
       
        $.ajax({ // AJAX call for packages from server
                  type: 'POST',
                  url: "http://paea0003:4567/api/packages",
                  processData: true,
                  crossDomain: true,
                  data: json,
                  dataType: "json",
                  success: function (data) {
                      console.log(data);
                    $scope.$apply(function(){
                      $scope.packages = data.data;
                      $scope.decodeAdditionalInfo($scope.packages); // need to decode the package information
                    });
                    var table = $('#packageList').DataTable({
                            searching: true,
                            lengthChange: false,
                            pageLength: 7
                    });
                    $('#loading').hide();
                    $('#searchPackages').on( 'keyup', function () {
                    table.search( this.value ).draw();
                    });

                  }
           });
                
              
       // need to check and import local changes into ajax list

        //var local = sessionStorage.getItem('packages');
        //var result = jQuery.parseJSON(local);
        //if(result === null) { // if we can't get local changes, we should't call the api
        //    dataTransfer.setPackage([]);
        //} else {
        //    dataTransfer.setPackage(result);
        //}
        // need to merge any local changes
       // mergeByProperty($scope.packages, result, 'id');

        //console.log($scope.packages);
        


});     // document ready end - function declarations


    // function that checks all the given checkboxes for a set in the datatable
    $('#checkbox_all').change(function() {
        $('tbody tr td input[type="checkbox"]').prop('checked', $(this).prop('checked'));
        // needs to load them into the modify set
        angular.forEach($scope.packages, function(value, key) { // for each value and key of the packages
            console.log(JSON.stringify(value.id)); // debug values
            $scope.getCheckData(value.id); // call the check data function to load the value into the edit list
        });
    });  
    
    

    // function that merges two lists into one based on duplicate properties
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
    $scope.getCheckData = function(id) {
        if(document.getElementById('checkbox-' + id).checked) { // if the checkbox is checked
            $.ajax({ // AJAX call for packages from server
                  type: 'POST',
                  url: "http://paea0003:4567/api/packages/" + id + "/get",
                  processData: true,
                  crossDomain: true,
                  data: {},
                  dataType: "json",
                  success: function (data) {
                      var localData = data.data[0];
                       $scope.$apply(function(){
                        $scope.decodePackageAdditionalInfo(localData.description, localData);
                           // push the checkbox object to the edit list
                        $scope.packageEditList.push({             
                            name: localData.name,
                            id: id,
                            desc: localData.description,
                            base: localData.sourceConfigurationPackageId,
                            cate: localData.usage
                        });
                        console.log($scope.packageEditList);  
                        if($scope.packageEditList.length !== 0) { // if there is anything in the list
                            document.getElementById('modifyButton').disabled = false; // make the buttons active
                            document.getElementById('deleteButton').disabled = false;
                        } else {
                            document.getElementById('modifyButton').disabled = true; // else disable it
                            document.getElementById('deleteButton').disabled = true;
                        }
                        });
                }
          });


        } else { // if someone unchecks 
            
            // use filter to find the package using the id and get it out of the array by returning everything but it
            if($scope.packageEditList.length <= 1) {
                $scope.packageEditList = [];
                //console.log($scope.packageEditList.length); // debug purposes
            } else {
                var index = $scope.packageEditList.indexOf(currentPackage.id);
                $scope.packageEditList.splice(index, 1);
            }

            if($scope.packageEditList.length !== 0) { // same as before, checking if we can still modify, delete, and compare packages
                document.getElementById('modifyButton').disabled = false;
                document.getElementById('deleteButton').disabled = false;
            } else {
                document.getElementById('modifyButton').disabled = true;
                document.getElementById('deleteButton').disabled = true;
            }
        }
    };

    // function that gets called when someone submits a created package
    $scope.createModal = function() {
        // modal validation - checks if the fields are empty
        if(document.getElementById("packageName").value === "") {
            alert("Package Name Cannot Be Empty!");
        } else if(document.getElementById("packageID").value === "") {
            alert("Package ID Cannot Be Empty!");
        } else if(!/^\d+$/.test(document.getElementById("packageID").value)) {
            alert("Package ID Must Be A Number");
        } else if(document.getElementById("packageID").value.length > 4) {
            alert("Package ID Must Be Less Than 4 Numbers");
        } else {
            // parse the selected category
            var box = document.getElementById('createPackageCate');
            if(box.options[box.selectedIndex].text === "Choose A Package") {
                $scope.create_package_cate = "";
            } else {
                $scope.create_package_cate = box.options[box.selectedIndex].text;
            }
            // parse the selected base package
            box = document.getElementById('createPackageBase');
            if(box.options[box.selectedIndex].text === "Choose A Category") {
                $scope.create_package_base = "";
            } else {
                $scope.create_package_base = box.options[box.selectedIndex].text;
            }

            // create a local package object
            var package = {
                name: $scope.create_package_name,
                id: $scope.create_package_id,
                desc: $scope.create_package_desc,
                base: $scope.create_package_base,
                cate: $scope.create_package_cate
            };

            // check if the package id is unique in the recordset
            for(var b = 0; b < $scope.packages.length; b++) {
                if($scope.packages[b].id == package.id) {
                    alert("Duplicate ID Found! Cannot Create Package");
                    $('#createPackageModal').modal('toggle'); // toggle the model
                    return; // if not return nothing and cancel the operation
                }
            }
            // console.log(package.name + " " + package.id + " " + package.desc + " " + package.base + " " + package.cate);

            dataTransfer.setTime(package); // set the time
            

            // then push the new package locally
            dataTransfer.checkCopy({
                action: "Create",
                sub: "Package",
                id: package.id,
                name: package.name,
                category: package.cate,
                desc: package.desc,
                time: package.time,
                url: "packageInfo",
                object: package
            });

            $scope.packages.push(package); // redraw the table on the window reload
            
            $('#createPackageModal').modal('toggle'); // toggle the model 
        }
    };


    // function that loads the selected data from the edit list into our modals
    $scope.loadModifyData = function() {
        // if we only have one package, display it
        if($scope.packageEditList.length <= 1) {
            document.getElementById('packageIDfield').placeholder = $scope.packageEditList[0].id;
            document.getElementById('packageNamefield').placeholder = $scope.packageEditList[0].name;
            document.getElementById('packageDescriptionfield').placeholder = $scope.packageEditList[0].desc;
            $("#selectPackageBase").val($scope.packageEditList[0].base).change();
            document.getElementById('selectPackageCate').value = $scope.packageEditList[0].cate;
        } else {
            // else we have to check if any package in the list has duplicates. If it does, we can display the duplicate.
            document.getElementById('packageIDfield').placeholder = "mixed";
            document.getElementById('packageNamefield').placeholder = "mixed";
            document.getElementById('packageDescriptionfield').placeholder = "mixed";
            document.getElementById('selectPackageBase').value = "mixed";
            document.getElementById('selectPackageCate').value = "mixed";
        }
        // each package in the list has to have a unique id, checkbox and input field should stay disabled for mixed changes  
        if(document.getElementById('packageIDfield').placeholder === "mixed") {
            document.getElementById('modifyPackageIDCheck').disabled = true;
            document.getElementById('packageIDfield').disabled = true;
        } else {
            document.getElementById('modifyPackageIDCheck').disabled = false;
            document.getElementById('packageIDfield').disabled = false;
        }
    };

    // function that gets called when we accept the modify modal 
    $scope.modifyModal = function() {
        // need to check what checkbox changes the user wants to submit for changes
        if(document.getElementById('modifyPackageNameCheck').checked === true) {
            $scope.modify_package_name = document.getElementById('packageNamefield').value;
            for(var i = 0; i < $scope.packageEditList.length; i++) { // for loop for multiple packages
                $scope.packageEditList[i].name = $scope.modify_package_name;
            }
            if(document.getElementById("packageNamefield").value === "") { // checks if the field is empty
                alert("Package Name Cannot Be Empty!");
                return;
            }
        }
        if(document.getElementById('modifyPackageIDCheck').checked === true) {
            $scope.modify_package_id = document.getElementById('packageIDfield').value;
            for(var i = 0; i < $scope.packageEditList.length; i++) {
                $scope.packageEditList[i].id = $scope.modify_package_id;
            }
            if($scope.packageEditList.length < 2) {
                if(document.getElementById("packageIDfield").value === "") {
                    alert("Package ID Cannot Be Empty!");
                    return;
                } else if(/^\d+$/.test(document.getElementById("packageID").value)) {
                    alert("Package ID Must Be a Number!");
                    return;
                } else if(document.getElementById("packageID").value.length > 4) {
                    alert("Package ID Must Be Less Than 4 Numbers");
                    return;
                }
            }
        }
        if(document.getElementById('modifyPackageDescCheck').checked === true) {
            $scope.modify_package_desc = document.getElementById('packageDescriptionfield').value;
            for(var i = 0; i < $scope.packageEditList.length; i++) {
                $scope.packageEditList[i].desc = $scope.modify_package_desc;
            }
        }
        if(document.getElementById('modifyPackageBaseCheck').checked === true) {
            var box = document.getElementById('selectPackageBase');
            $scope.modify_package_base = box.options[box.selectedIndex].text;
            for(var i = 0; i < $scope.packageEditList.length; i++) {
                $scope.packageEditList[i].base = $scope.modify_package_base;
            }
        }
        if(document.getElementById('modifyPackageCateCheck').checked === true) {
            var box = document.getElementById('selectPackageCate');
            $scope.modify_package_cate = box.options[box.selectedIndex].text;
            for(var i = 0; i < $scope.packageEditList.length; i++) {
                $scope.packageEditList[i].cate = $scope.modify_package_cate;
            }
        }
        
        // push the list locally
        for(var i = 0; i < $scope.packageEditList.length; i++) {
            var package = {
            name: $scope.packageEditList[i].name, id: $scope.packageEditList[i].id,
            cate: $scope.packageEditList[i].cate, desc: $scope.packageEditList[i].desc, base: $scope.packageEditList[i].base
            };
            dataTransfer.setTime($scope.packageEditList[i]);
            dataTransfer.checkCopy({
                action: "Modify",
                sub: "Package",
                id: $scope.packageEditList[i].id,
                name: $scope.packageEditList[i].name,
                category: $scope.packageEditList[i].cate,
                desc: $scope.packageEditList[i].desc,
                url: "packageInfo",
                time: $scope.packageEditList[i].time,
                object: package});
            
            $scope.packages.push(package);
        }
        $('#modifyPackageModal').modal('toggle'); // toggle the model     
    };



    // function that is called when we accept the delete modal
    $scope.deleteModal = function() {

        // then push the deleted package(s) locally
        for(var i = 0; i < $scope.packageEditList.length; i++) {
            
            var package = {
            name: $scope.packageEditList[i].name, id: $scope.packageEditList[i].id,
            cate: $scope.packageEditList[i].cate, desc: $scope.packageEditList[i].desc, 
            base: $scope.packageEditList[i].base
            };
            
           dataTransfer.setTime($scope.packageEditList[i]);
           dataTransfer.checkCopy({
                action: "Delete",
                sub: "Package",
                id: $scope.packageEditList[i].id,
                name: $scope.packageEditList[i].name,
                category: $scope.packageEditList[i].cate,
                desc: $scope.packageEditList[i].desc,
                url: "",
                time: $scope.packageEditList[i].time,
                object: package});            
        }
        
        $('#deletePackageModal').modal('toggle'); // toggle the model
        $location.path("/");
    };
    
    // dummy function that just logs the length of the packageEditList
    $scope.test = function() {
        console.log($scope.packageEditList.length);
    };
    
    // helper function to encode escape characters in json string for database
    $scope.escapeSpecialChar = function(string) {
        var myEscapedJSONString = string
            .replace(/[\\]/g, '\\\\')
            .replace(/[\"]/g, '\\\"')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
        return myEscapedJSONString;
    };

    // function that decodes the description and usage from the database            
    $scope.decodeAdditionalInfo = function(list) {
        for(var i = 0; i < list.length; i++) {
            var string = list[i].description;
            if(string.substr(0, 1) === "{") {
                var local = JSON.parse(string);
                list[i].description = local.description;
                list[i].usage = local.usage;
            } else {
                list[i].description = string;
                list[i].usage = "";
            }
        }
    };

    $scope.decodePackageAdditionalInfo = function(string, object){
        if(string.substr(0, 1) === "{") {
                var local = JSON.parse(string);
                object.description = local.description;
                object.usage = local.usage;
            } else {
                object.description = string;
                object.usage = "";
            }
    };

    // function that encodes the description and usage for the json database
    $scope.encodeAdditionalInfo = function() {
        for(var i = 0; i < $scope.packages.length; i++) { // for every item in the package list
            var localObject = {
                description: $scope.description,
                usage: $scope.usage
            };
            // set the description equal to the helper function result (returns a string)
            $scope.packages[i].description = $scope.escapeSpecialChar(JSON.stringify(localObject));
        }

    };


    // function declaration over - inject content section


    // this will be the list of usage categories ! 
    $scope.categories = [{
        name: "Health and Wellness"
    }, {
        name: "NextGen"
    }];


    // temp package for checkbox data
    var currentPackage = {
        name: "",
        id: "",
        desc: "",
        base: "",
        cate: ""
    };

    // this is the list for checkbox objects - objects we want to make changes too
    $scope.packageEditList = [];
});
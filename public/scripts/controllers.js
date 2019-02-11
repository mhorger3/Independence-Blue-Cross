
	// create the controller and inject Angular's $scope
	configApp.controller('mainController', function($scope, dataTransfer) {
		// create a message to display in our view

        $scope.QAchangesList = [
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"}
            ];   
              
        var QAstorage = dataTransfer.getQA();
        
        $scope.QAchangesList = QAstorage;    
            
         $scope.PRDchangesList = [
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"},
            {action: "New Package", sub: "", id: "291", name: "testPackage", category: "NextGen", url: "packageInfo", time: "x"}
         ];    
         
        var PRDstorage = dataTransfer.getPRD();

        $scope.PRDchangesList = PRDstorage;
  
  
        $scope.deleteChange = function(id) {
            if(QAstorage.length <= 1){
                         QAstorage = [];
                     //    alert($scope.packageEditList.length); debug purposes
                    } else {
                    
                    var index = QAstorage.indexOf(id);
                    QAstorage.splice(index, 1);
                    
            }
             $('#deleteChangesModal').modal('toggle');
             location.reload();
        };
        
        $scope.editChange = function(id, url) {
           alert(id); // debug
           alert(url); // debug
           
        };

        $scope.savePRD = function() {
            // set the local list equal to whatever was in QA
            PRDstorage = dataTransfer.getQA();
            $scope.PRDchangesList = PRDstorage;
            dataTransfer.setPRD($scope.PRDchangesList);
            // save the QA changes by calling DB
            // clear the local QA list
            $scope.QAchangesList = [];
            QAstorage = [];
            sessionStorage.clear('qa');
            // toggle the modal
            $('#pushCartModal').modal('toggle');
        };
  
        window.onbeforeunload = function() {
          sessionStorage.setItem('qa', JSON.stringify(QAstorage));
          sessionStorage.setItem('prd', JSON.stringify(PRDstorage));
        };
        
         window.onload = function() {
            var QAConnection = sessionStorage.getItem('qa');
            var PRDConnection = sessionStorage.getItem('prd');
           // alert(name); // debug
            var QAparse = jQuery.parseJSON(QAConnection);
            var PRDparse = jQuery.parseJSON(PRDConnection);
           // console.log(parse); // debug
           
           
           if(QAparse === null || PRDparse === null){
               dataTransfer.setQA([]);
               dataTransfer.setPRD([]); 
            } else {
                dataTransfer.setQA(QAparse);
                dataTransfer.setPRD(PRDparse); 
            }

         };
         
	});

	configApp.controller('packageViewController', function($scope, dataTransfer) {
              //this is where our data will be entered from API - list of all packages
          $scope.packages = [
              {name: 'Base Package', id: '0', source: '', mnemonics: '243', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '50', source: '001', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '20', source: '003', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '10', source: '005', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '60', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '70', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'Base Package', id: '25', source: '', mnemonics: '243', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '80', source: '001', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '90', source: '003', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '100', source: '005', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '150', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '250', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '350', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '450', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '550', source: '', mnemonics: '40', updated: '04/15/2016'}
          ];
         
          // this will be the list of usage categories from the api  
        $scope.categories = [{name: "Health and Wellness"},{name: "NextGen"}];
            
            
            
            // temp package for checkbox data
            var currentPackage = {name: "", id: "", desc: "", base: "", cate: ""};
            
            // this is the list for checkbox objects - objects we want to make changes too
            $scope.packageEditList = [];  
            
            //function that gets the data on the selected row of the checkbox
            $scope.getCheckData = function(name, id) {
            
                if((document.getElementById('checkbox-' + id)).checked){ // if the checkbox is checked
                   // alert(name + id + source + mnemonics + updated); // debug info from table
                    currentPackage.name = name; // get the package info
                    currentPackage.id = id;
                    currentPackage.desc = "desc";
                    currentPackage.base = "idk";
                    currentPackage.cate = "NextGen";
                    // push the checkbox to the edit list
                    $scope.packageEditList.push({
                        name: currentPackage.name, id: currentPackage.id, desc: currentPackage.desc,
                        base: currentPackage.base, cate: currentPackage
                    });
                    if($scope.packageEditList.length !== 0){
                    document.getElementById('modifyButton').disabled = false;
                    document.getElementById('deleteButton').disabled = false;
                    } else{
                    document.getElementById('modifyButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    }
 
                } else { // if someone unchecks 
                    // use filter to find the package using the id and get it out of the array by returning everything but it
                    if($scope.packageEditList.length <= 1){
                         $scope.packageEditList = [];
                     //    alert($scope.packageEditList.length); debug purposes
                    } else {
                    
                    var index = $scope.packageEditList.indexOf(currentPackage.id);
                    $scope.packageEditList.splice(index, 1);
                    
                  //  debug purposes
                   // alert($scope.packageEditList.length); 
                  //  for(var i = 0; i < $scope.packageEditList.length; i++){
                  //      alert($scope.packageEditList[i].id);
                  //  }
                    
                    }
                   if($scope.packageEditList.length !== 0){
                    document.getElementById('modifyButton').disabled = false;
                    document.getElementById('deleteButton').disabled = false;
                    } else{
                    document.getElementById('modifyButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    }
                }
            };
      

            $scope.createModal = function() {
               
                var package = {
                    name: $scope.create_package_name,
                    id: $scope.create_package_id,
                    desc: $scope.create_package_desc,
                    base: $scope.create_package_base,
                    cate: $scope.create_package_cate
                }; 
                
                // debug 
                // alert(package.name + " " + package.id + " " + package.desc + package.base + package.cate); // test purposes

                // check if the package id and name is unique in the recordset
                

                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time);
                // clear the service data
                dataTransfer.clearDate();
                    
                // then push the new package locally
                 QA.push({action: "Create", sub: "", id: package.id, name: package.name, category: package.cate, url: "packageInfo", time: time});
                // debug purposes
                // for(var i=0; i < QA.length; i++){
                //    alert(QA[i].id);
                // }
                
                // then push the new list
                dataTransfer.setQA(QA);

                // redraw the table
                
                // toggle the model
                $('#createPackageModal').modal('toggle');
               
               
               
            };
               
            // function that loads the selected data from the edit list into our modify view
            $scope.loadModifyData = function() {
            
            // if we only have one package, display it
            if($scope.packageEditList.length <= 1){
                document.getElementById('packageIDfield').placeholder = ($scope.packageEditList[0].id);
                document.getElementById('packageNamefield').placeholder = ($scope.packageEditList[0].name);
                document.getElementById('packageDescriptionfield').placeholder = ($scope.packageEditList[0].desc);
                document.getElementById('selectPackageBase').value = $scope.packageEditList[0].base;
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
            if(document.getElementById('packageIDfield').placeholder === "mixed"){
                    document.getElementById('modifyPackageIDCheck').disabled = true;
                    document.getElementById('packageIDfield').disabled = true;
                } else 
                {
                    document.getElementById('modifyPackageIDCheck').disabled = false;
                    document.getElementById('packageIDfield').disabled = false;
                }

            };       
          
            
            $scope.modifyModal = function() {
                
      
 
                // need to check what checkbox changes the user wants to submit for changes
                if (document.getElementById('modifyPackageNameCheck').checked === true){
                   $scope.modify_package_name = document.getElementById('packageNamefield').value;
                }
                if (document.getElementById('modifyPackageIDCheck').checked === true){
                   $scope.modify_package_id = document.getElementById('packageIDfield').value;
                }
                if (document.getElementById('modifyPackageDescCheck').checked === true){
                   $scope.modify_package_desc = document.getElementById('packageDescriptionfield').value;
                }
                if (document.getElementById('modifyPackageBaseCheck').checked === true){
                    var box = document.getElementById('selectPackageBase');
                   $scope.modify_package_base = box.options[box.selectedIndex].text;
                }
                if (document.getElementById('modifyPackageCateCheck').checked === true){
                    var box = document.getElementById('selectPackageCate');
                   $scope.modify_package_cate = box.options[box.selectedIndex].text;
                }
                
                
                
                 
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                //alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();

                for(var i = 0; i < $scope.packageEditList.length; i++){
                    
                    QA.push({action: "Modify", sub: "Settings", id: $scope.packageEditList[i].id, name: $scope.modify_package_name, category: $scope.modify_package_cate, url: "packageInfo", time: time});
                }
                
                // then push the new list
                 dataTransfer.setQA(QA);
    
                // redraw the table
                
                $('#modifyPackageModal').modal('toggle'); // toggle the model
                
            };
            
            $scope.deleteModal = function() {
                
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
               // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the deleted mnemonic(s) locally
                for(var i = 0; i < $scope.packageEditList.length; i++){
                //    alert($scope.mnemonicEditList[i].name); // debug
                 QA.push({action: "Delete", sub: "", id: $scope.packageEditList[i].id, name: $scope.packageEditList[i].name, category: "", url: "", time: time});
                }

                // then push the new list
                // dataTransfer.setQA(QA);
    
                // redraw the table
                
                $('#deletePackageModal').modal('toggle'); // toggle the model
            };
	});

	configApp.controller('mnemonicViewController', function($scope, dataTransfer) {
                                  
            //this is where our data will be entered from API - list of all mnemonics
            $scope.mnemonics = [
                {name: 'about_mobile', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'}
            ];
            
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
       
            
            $scope.mnemonicEditList = [];
                       
            //function that gets the data on the selected row of the checkbox
            $scope.getCheckData = function(name) {
                document.getElementById('modifyButton').disabled = !(document.getElementById('checkbox-' + name)).checked;
                document.getElementById('deleteButton').disabled = !(document.getElementById('checkbox-' + name)).checked;
                if((document.getElementById('checkbox-' + name)).checked){
                    // we need to call the api for each sub-field of the mnemonic
                    currentMnemonic.name = name;
                    currentMnemonic.cate = "";
                    $scope.mnemonicEditList.push(
                            {name: currentMnemonic.name, cate: currentMnemonic.cate, navi: currentMnemonic.navi, 
                            cap: currentMnemonic.cap, mobile: currentMnemonic.mobile, dis: currentMnemonic.dis,
                            url: currentMnemonic.url, loc: currentMnemonic.loc, rel: currentMnemonic.rel});
                    // push the mnemonic to the list if its checked
                    
                    if($scope.mnemonicEditList.length !== 0){
                    document.getElementById('modifyButton').disabled = false;
                    document.getElementById('deleteButton').disabled = false;
                    } else{
                    document.getElementById('modifyButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    }
                    
                    
                } else {
                    if($scope.mnemonicEditList.length <= 1){
                         $scope.mnemonicEditList = []; // reset the list if there isn't a mnemonic
                     //    alert($scope.mnemonicEditList.length); debug purposes
                    } else {
                    
                    var index = $scope.mnemonicEditList.indexOf(currentMnemonic.name); // else remove the check
                    $scope.mnemonicEditList.splice(index, 1);
                        
                   //debug purposes
                   // alert($scope.mnemonicEditList.length); debug purposes
                   // for(var i = 0; i < $scope.mnemonicEditList.length; i++){
                   //     alert($scope.mnemonicEditList[i].name);
                   // }
                    
                    }
                   if($scope.mnemonicEditList.length !== 0){
                    document.getElementById('modifyButton').disabled = false;
                    document.getElementById('deleteButton').disabled = false;
                    } else{
                    document.getElementById('modifyButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    }
                }
                // else remove the mnemonic from the list
            };
            
             // function that loads the selected data from the edit list into our modify view
            $scope.loadModifyData = function() {              
                // if only one item is in the list
                if($scope.mnemonicEditList.length <= 1){
                    document.getElementById('mnemonicNameField').placeholder = $scope.mnemonicEditList[0].name;
                    document.getElementById('mnemonicCategoryField').placeholder = $scope.mnemonicEditList[0].cate;
                    document.getElementById('mnemonicNavigableField').placeholder = $scope.mnemonicEditList[0].navi;
                    document.getElementById('mnemonicCapabilityField').placeholder = $scope.mnemonicEditList[0].cap;
                    document.getElementById('mnemonicMobileField').placeholder = $scope.mnemonicEditList[0].mobile;
                    document.getElementById('mnemonicDisplayField').placeholder = $scope.mnemonicEditList[0].dis;
                    document.getElementById('mnemonicURLField').placeholder = $scope.mnemonicEditList[0].url;
                    document.getElementById('mnemonicNavigationField').placeholder = $scope.mnemonicEditList[0].loc;
                    document.getElementById('mnemonicRelatedField').placeholder = $scope.mnemonicEditList[0].rel;
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
                
            };
            
            
            $scope.modifyModal = function() {
                

                // need to check what checkbox changes the user wants to submit for changes
                if (document.getElementById('modifyMnemonicNameCheck').checked === true){
                   $scope.modify_keyword_name = document.getElementById('mnemonicNameField').value;
                }
                if (document.getElementById('modifyMnemonicCateCheck').checked === true){
                   $scope.modify_keyword_cate = document.getElementById('mnemonicCategoryField').value;
                }
                if (document.getElementById('modifyMnemonicNaviCheck').checked === true){
                   $scope.modify_keyword_navi = document.getElementById('mnemonicNavigableField').value;
                }
                if (document.getElementById('modifyMnemonicCapCheck').checked === true){
                   $scope.modify_keyword_cap = document.getElemenyById('mnemonicCapabilityField').value;
                }
                if (document.getElementById('modifyMnemonicMobileCheck').checked === true){
                   $scope.modify_keyword_mobile = document.getElementById('mnemonicMobileField').value;
                }
                if (document.getElementById('modifyMnemonicDisplayCheck').checked === true){
                   $scope.modify_keyword_dis = document.getElementById('mnemonicDisplayField').value;
                }
                if (document.getElementById('modifyMnemonicURLCheck').checked === true){
                   $scope.modify_keyword_url = document.getElemenyById('mnemonicURLField').value;
                }
                if (document.getElementById('modifyMnemonicLocCheck').checked === true){
                   $scope.modify_keyword_loc = document.getElementById('mnemonicNavigationField').value;
                }
                 if (document.getElementById('modifyMnemonicRelCheck').checked === true){
                   $scope.modify_keyword_rel = document.getElementById('mnemonicRelatedField').value;
                }
                
                
                
                 
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
               // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();

                for(var i = 0; i < $scope.mnemonicEditList.length; i++){
                    
                    //QA.push({action: "Modify", sub: "Settings", id: $scope.packageEditList[i].id, name: $scope.modify_package_name, category: $scope.modify_package_cate, url: "packageInfo", time: time});
                
                }
                
                // then push the new list
                // dataTransfer.setQA(QA);
    
                // redraw the table
                
                // toggle the model
                   $('#modifyMnemonicModal').modal('toggle'); 
            };
            

            $scope.createModal = function() {
                
                var mnemonic = [
                    {
                    name: $scope.create_mnemonic_name,
                    cate: $scope.create_mnemonic_cate,
                    navi: $scope.create_mnemonic_navi,
                    cap: $scope.create_mnemonic_cap,
                    mobile: $scope.create_mnemonic_mobile,
                    dis: $scope.create_mnemonic_display,
                    url: $scope.create_mnemonic_url,
                    loc: $scope.create_mnemonic_loc,
                    rel: $scope.create_mnemonic_rel
                    }
                ];
                
                // check if the mnemonic version id is unique in the recordset
                
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time);
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the new mnemonic locally
                QA.push({action: "Create", sub: "", id: "mnemonic.id", name: mnemonic.name, category: mnemonic.cate, url: "mnemonicInfo", time: time});
                
                for(var i=0; i < QA.length; i++){
                    alert(QA[i].id);
                }
                
                // then push the new list
                dataTransfer.setQA(QA);
                
                // redraw the table
                
                // toggle the model
                $('#createMnemonicModal').modal('toggle');           
            };
            
            $scope.deleteModal = function() {
                  // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the deleted mnemonic(s) locally
                for(var i = 0; i < $scope.mnemonicEditList.length; i++){
                //    alert($scope.mnemonicEditList[i].name); // debug
                 QA.push({action: "Delete", sub: "", id: "mnemonic.id", name: $scope.mnemonicEditList[i].name, category: "", url: "", time: time});
                }

                // then push the new list
                //dataTransfer.setQA(QA);
                
                // redraw the table
    
                $('#deleteMnemonicModal').modal('toggle'); // toggle the model
                
        };

            
	});
        
        configApp.controller('keywordViewController', function($scope, dataTransfer) {
                
            $scope.mnemonics = [
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits_right', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits_right', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits_right', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""},
                 {name: 'benefits', category: 'Benefits Overview', navigable: 'My Benefits Overview', display: 'benefits', mobile: 'in app', url: 'Flyout Core', related: ""}
  
            ]; 
                
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
       
            
            $scope.mnemonicEditList = [];
                       
             //function that gets the data on the selected row of the checkbox           
            $scope.getCheckData = function(name) {
               
                if((document.getElementById('checkbox-' + name)).checked){
                    // we need to call the api for each sub-field of the mnemonic
                    currentMnemonic.name = name;
                    currentMnemonic.cate = "";
                    $scope.mnemonicEditList.push(
                            {name: currentMnemonic.name, cate: currentMnemonic.cate, navi: currentMnemonic.navi, 
                            cap: currentMnemonic.cap, mobile: currentMnemonic.mobile, dis: currentMnemonic.dis,
                            url: currentMnemonic.url, loc: currentMnemonic.loc, rel: currentMnemonic.rel});
                    // push the mnemonic to the list if its checked
                    
                    if($scope.mnemonicEditList.length !== 0){
                    document.getElementById('modifyButton').disabled = false;
                    document.getElementById('deleteButton').disabled = false;
                    } else{
                    document.getElementById('modifyButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    }
                    
                    
                    
                } else {
                     if($scope.mnemonicEditList.length <= 1){
                         $scope.mnemonicEditList = [];
                     //    alert($scope.mnemonicEditList.length); debug purposes
                    } else {
                    
                    var index = $scope.mnemonicEditList.indexOf(currentMnemonic.name);
                    $scope.mnemonicEditList.splice(index, 1);
                        
                   //debug purposes
                   // alert($scope.mnemonicEditList.length); debug purposes
                   // for(var i = 0; i < $scope.mnemonicEditList.length; i++){
                   //     alert($scope.mnemonicEditList[i].name);
                   // }
                    
                    }
                   if($scope.mnemonicEditList.length !== 0){
                    document.getElementById('modifyButton').disabled = false;
                    document.getElementById('deleteButton').disabled = false;
                    } else{
                    document.getElementById('modifyButton').disabled = true;
                    document.getElementById('deleteButton').disabled = true;
                    }
                }

            };
            
             // function that loads the selected data from the edit list into our modify view
            $scope.loadModifyData = function() {              
                // if only one item is in the list
               if($scope.mnemonicEditList.length <= 1){
                    document.getElementById('mnemonicNameField').placeholder = $scope.mnemonicEditList[0].name;
                    document.getElementById('mnemonicCategoryField').placeholder = $scope.mnemonicEditList[0].cate;
                    document.getElementById('mnemonicNavigableField').placeholder = $scope.mnemonicEditList[0].navi;
                    document.getElementById('mnemonicCapabilityField').placeholder = $scope.mnemonicEditList[0].cap;
                    document.getElementById('mnemonicMobileField').placeholder = $scope.mnemonicEditList[0].mobile;
                    document.getElementById('mnemonicDisplayField').placeholder = $scope.mnemonicEditList[0].dis;
                    document.getElementById('mnemonicURLField').placeholder = $scope.mnemonicEditList[0].url;
                    document.getElementById('mnemonicNavigationField').placeholder = $scope.mnemonicEditList[0].loc;
                    document.getElementById('mnemonicRelatedField').placeholder = $scope.mnemonicEditList[0].rel;
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
                
            };
            
            $scope.createModal = function() {
                
                var mnemonic = [
                    {
                    name: $scope.create_mnemonic_name,
                    cate: $scope.create_mnemonic_cate,
                    navi: $scope.create_mnemonic_navi,
                    cap: $scope.create_mnemonic_cap,
                    mobile: $scope.create_mnemonic_mobile,
                    dis: $scope.create_mnemonic_display,
                    url: $scope.create_mnemonic_url,
                    loc: $scope.create_mnemonic_loc,
                    rel: $scope.create_mnemonic_rel
                    }
                ];
                 
                 // check if the mnemonic version id is unique in the recordset
                
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the new mnemonic locally
                QA.push({action: "Create", sub: "", id: "mnemonic.id", name: mnemonic.name, category: mnemonic.cate, url: "mnemonicInfo", time: time});
                
                // then push the new list
                dataTransfer.setQA(QA);

                // redraw the table
                // 
                //toggle the model
                $('#createMnemonicModal').modal('toggle');      
            };
            
            $scope.deleteModal = function() {
                
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the deleted mnemonic(s) locally
                for(var i = 0; i < $scope.mnemonicEditList.length; i++){
                //    alert($scope.mnemonicEditList[i].name); // debug
                 QA.push({action: "Delete", sub: "", id: "", name: $scope.mnemonicEditList[i].name, category: "", url: "", time: time});
                }

                // then push the new list
                //dataTransfer.setQA(QA);
    
                // redraw the table
    
                $('#deleteMnemonicModal').modal('toggle'); // toggle the model
                
                
            };
            
            $scope.modifyModal = function() {
              
                // need to check what checkbox changes the user wants to submit for changes
                if (document.getElementById('modifyMnemonicNameCheck').checked === true){
                   $scope.modify_keyword_name = document.getElementById('mnemonicNameField').value;
                }
                if (document.getElementById('modifyMnemonicCateCheck').checked === true){
                   $scope.modify_keyword_cate = document.getElementById('mnemonicCategoryField').value;
                }
                if (document.getElementById('modifyMnemonicNaviCheck').checked === true){
                   $scope.modify_keyword_navi = document.getElementById('mnemonicNavigableField').value;
                }
                if (document.getElementById('modifyMnemonicCapCheck').checked === true){
                   $scope.modify_keyword_cap = document.getElemenyById('mnemonicCapabilityField').value;
                }
                if (document.getElementById('modifyMnemonicMobileCheck').checked === true){
                   $scope.modify_keyword_mobile = document.getElementById('mnemonicMobileField').value;
                }
                if (document.getElementById('modifyMnemonicDisplayCheck').checked === true){
                   $scope.modify_keyword_dis = document.getElementById('mnemonicDisplayField').value;
                }
                if (document.getElementById('modifyMnemonicURLCheck').checked === true){
                   $scope.modify_keyword_url = document.getElemenyById('mnemonicURLField').value;
                }
                if (document.getElementById('modifyMnemonicLocCheck').checked === true){
                   $scope.modify_keyword_loc = document.getElementById('mnemonicNavigationField').value;
                }
                 if (document.getElementById('modifyMnemonicRelCheck').checked === true){
                   $scope.modify_keyword_rel = document.getElementById('mnemonicRelatedField').value;
                }
                
                
                
                 
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();

                for(var i = 0; i < $scope.mnemonicEditList.length; i++){
                    
                    //QA.push({action: "Modify", sub: "Settings", id: "", name: $scope.modify_keyword_name, category: $scope.modify_keyword_cate, url: "mnemonicInfo", time: time});
                
                }
                
                // then push the new list
                // dataTransfer.setQA(QA);
    
                // redraw the table
                
                   $('#modifyMnemonicModal').modal('toggle'); // toggle the model
            };
                
	});
        
        
        
        
        
        
        
        
        configApp.controller('packageInfoController', function($scope, $routeParams, dataTransfer) {
        $scope.model = {
            id: $routeParams.id
        };
        
        // this is where we can set the name based off of id by calling an api service
        $scope.name = $routeParams.id;

            // this is where we determine what mnemonics are part of the local id in route
        $scope.mnemonics = [
            {name:'benefits', capability:'Benefits Overview', packages: '80', updated: '10/1/12'},
            {name:'benefits_left', capability:'Benefits', packages: '15', updated: '10/1/12'},
            {name:'benefits_right', capability:'Benefits', packages: '15', updated: '10/1/12'},
            {name:'benefits_mobile', capability:'Benefits Overview', packages: '10', updated: '10/1/12'},
            {name:'boring', capability:'BoringSauce' ,packages: '05', updated: '10/1/12'}
        ];
        
        // get list of full mnemonics
        $scope.fullMnemonics = [
            {name:'benefits',  packages: '80'},
            {name:'benefits_left', packages: '15'},
            {name:'benefits_right', packages: '15'},
            {name:'benefits_mobile',  packages: '10'},
            {name:'boring', packages: '05'},
            {name:'benefits', packages: '80'},
            {name:'benefits_left', packages: '15'},
            {name:'benefits_right', packages: '15'},
            {name:'benefits_mobile', packages: '10'},
            {name:'boring', packages: '05'}
        ];
        
          // this will be the list of usage categories from the api  
        $scope.categories = [{name: "Health and Wellness"},{name: "NextGen"}];
        $scope.searchKeyword = '';
            
        $scope.packages = [
              {name: 'Base Package', id: '0', source: '', mnemonics: '243', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '50', source: '001', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '20', source: '003', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '10', source: '005', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '60', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '70', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'Base Package', id: '25', source: '', mnemonics: '243', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '80', source: '001', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '90', source: '003', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '100', source: '005', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '150', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '250', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '350', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '450', source: '', mnemonics: '40', updated: '04/15/2016'},
              {name: 'IBX Dental Only', id: '550', source: '', mnemonics: '40', updated: '04/15/2016'}
          ];    
            
        $scope.loadModifyData = function() {              
                //  this is where we will load our data
                document.getElementById('packageIDfield').placeholder = ($scope.packageEditList[0].id);
                document.getElementById('packageNamefield').placeholder = ($scope.packageEditList[0].name);
                document.getElementById('packageDescriptionfield').placeholder = ($scope.packageEditList[0].desc);
                document.getElementById('selectPackageBase').value = $scope.packageEditList[0].base;
                document.getElementById('selectPackageCate').value = $scope.packageEditList[0].cate;

                
            };
            
        $scope.modifyModal = function() {

                // need to check what checkbox changes the user wants to submit for changes
                if (document.getElementById('modifyPackageNameCheck').checked === true){
                   $scope.modify_package_name = document.getElementById('packageNamefield').value;
                }
                if (document.getElementById('modifyPackageIDCheck').checked === true){
                   $scope.modify_package_id = document.getElementById('packageIDfield').value;
                }
                if (document.getElementById('modifyPackageDescCheck').checked === true){
                   $scope.modify_package_desc = document.getElementById('packageDescriptionfield').value;
                }
                if (document.getElementById('modifyPackageBaseCheck').checked === true){
                    var box = document.getElementById('selectPackageBase');
                   $scope.modify_package_base = box.options[box.selectedIndex].text;
                }
                if (document.getElementById('modifyPackageCateCheck').checked === true){
                    var box = document.getElementById('selectPackageCate');
                   $scope.modify_package_cate = box.options[box.selectedIndex].text;
                }
                
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();

                QA.push({action: "Modify", sub: "Settings", id: $scope.modify_package_id, name: $scope.modify_package_name, category: $scope.modify_package_cate, url: "packageInfo", time: time});

                // then push the new list
                 dataTransfer.setQA(QA);
    
                // redraw the table
                
                $('#modifyPackageModal').modal('toggle'); // toggle the model
                
            };
            
            
             $scope.deleteModal = function() {
                
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the deleted mnemonic(s) locally
              
                //    alert($scope.mnemonicEditList[i].name); // debug
                 QA.push({action: "Delete", sub: "", id: "$package_id", name: "package_name", category: "", url: "", time: time});
                

                // then push the new list
                // dataTransfer.setQA(QA);
    
                // redraw the table
                
                $('#deletePackageModal').modal('toggle'); // toggle the model
            };
            
	});
        

	configApp.controller('mnemonicInfoController', function($scope, $routeParams, dataTransfer) {
        $scope.model = {
            id: $routeParams.id
        };

        $scope.name = $routeParams.id;
             	
          // these are the packages that the mnemonic is in - need to call api with appropriate mnemonic  
        $scope.packages = [
            {name:'Base Package (NextGen)', ID:'000', mnemonics: '243', updated: '10/1/12'},
            {name:'Core Package (NextGen)', ID:'001', mnemonics: '241', updated: '10/1/12'},
            {name:'Drexel University (NextGen)', ID:'003', mnemonics: '89', updated: '10/1/12'},
            {name:'IBCUniversity (Health and Wellness)', ID:'005', mnemonics: '42', updated: '10/1/12'},
            {name:'Base Package (NextGen)', ID:'000', mnemonics: '243', updated: '10/1/12'},
            {name:'Core Package (NextGen)', ID:'001', mnemonics: '241', updated: '10/1/12'},
            {name:'Drexel University (NextGen)', ID:'003', mnemonics: '89', updated: '10/1/12'},
            {name:'IBCUniversity (Health and Wellness)', ID:'005', mnemonics: '42', updated: '10/1/12'},
            {name:'Base Package (NextGen)', ID:'000', mnemonics: '243', updated: '10/1/12'},
            {name:'Core Package (NextGen)', ID:'001', mnemonics: '241', updated: '10/1/12'},
            {name:'Drexel University (NextGen)', ID:'003', mnemonics: '89', updated: '10/1/12'},
            {name:'IBCUniversity (Health and Wellness)', ID:'005', mnemonics: '42', updated: '10/1/12'},
            {name:'Test', ID:'008', mnemonics: '41', updated: '10/1/12'}
        ];
        
        // these are all of the packages in the tool
        $scope.fullPackages = [
            {name:'Base Package', ID: '003'},
            {name: 'Core Package', ID: '002'},
            {name: 'Core Package', ID: '002'},
            {name: 'Core Package', ID: '002'},
            {name: 'Core Package', ID: '002'},
            {name: 'Core Package', ID: '002'}
        ];
        
        
        $scope.searchKeyword = '';   
              
            
        $scope.visibility = [
            {
                fullyInsured: '', selfInsured: '', 
                medical: '', dental: '', vision: '',
                rx: '', rxClaims: '', rxClaimsInd: '', 
                rxClaimsSm: '', rxClaimsLg: '', hmo: '',
                pos: '', ppo: '', pho: '', posPlus: '',
                posPlusSEH: '', ucciDental: '', blueDental: '',
                hsa: '', enrollHSA: '', fsa: '', hra: '',
                dca: '', multiplan: '', idTheft: '', cce: '',
                hcr: '', telemedicine: '', reward: '', challenge: '',
                wellnessCore: '', individual: '', smallGroup: '',
                largeGroup: '', directPay: '', blueExtraBasic: '',
                blueExtraPlus: '', medicare: '', mediGap: '', 
                subscriber: '', spouse: '', spouse_dep: '', dept: '',
                preEffectuated: '', future: '', active: '', termed: '',
                demo: '', windowsDesktop: '', macDesktop: '', androidDesktop: '',
                ipadDesktop: '', androidTablet: '', ipadTablet: '', windowsTablet: '',
                androidPhone: '', iosPhone: '', androidMobile: '', iosMobile: '',
                windowsMobile: '', DEV: '', QA: '', PROD: '', global: ''
            }              
        ];            
            
            
            
         $scope.loadVisibility = function () {
             var package = $scope.loadSettings;
             alert(package); // debug
             
             // need to call the api to load the settings to the modal list
             
             
         };
         
         $scope.loadModalSettings = function () {
           var package = $scope.loadSettingsModal;
           alert(package);
         };
         
         $scope.submitSettings = function() {
             
             
             
             
             $('#editVisibilityModal').modal('toggle'); // toggle the model
             
             
         };
         
         $scope.loadModifyData = function() {              

                // this is where we will load the data in for the field
                    document.getElementById('mnemonicNameField').placeholder = $scope.mnemonicEditList[0].name;
                    document.getElementById('mnemonicCategoryField').placeholder = $scope.mnemonicEditList[0].cate;
                    document.getElementById('mnemonicNavigableField').placeholder = $scope.mnemonicEditList[0].navi;
                    document.getElementById('mnemonicCapabilityField').placeholder = $scope.mnemonicEditList[0].cap;
                    document.getElementById('mnemonicMobileField').placeholder = $scope.mnemonicEditList[0].mobile;
                    document.getElementById('mnemonicDisplayField').placeholder = $scope.mnemonicEditList[0].dis;
                    document.getElementById('mnemonicURLField').placeholder = $scope.mnemonicEditList[0].url;
                    document.getElementById('mnemonicNavigationField').placeholder = $scope.mnemonicEditList[0].loc;
                    document.getElementById('mnemonicRelatedField').placeholder = $scope.mnemonicEditList[0].rel;
           
                
            };
            
           $scope.modifyModal = function() {
                

                // need to check what checkbox changes the user wants to submit for changes
                if (document.getElementById('modifyMnemonicNameCheck').checked === true){
                   $scope.modify_keyword_name = document.getElementById('mnemonicNameField').value;
                }
                if (document.getElementById('modifyMnemonicCateCheck').checked === true){
                   $scope.modify_keyword_cate = document.getElementById('mnemonicCategoryField').value;
                }
                if (document.getElementById('modifyMnemonicNaviCheck').checked === true){
                   $scope.modify_keyword_navi = document.getElementById('mnemonicNavigableField').value;
                }
                if (document.getElementById('modifyMnemonicCapCheck').checked === true){
                   $scope.modify_keyword_cap = document.getElemenyById('mnemonicCapabilityField').value;
                }
                if (document.getElementById('modifyMnemonicMobileCheck').checked === true){
                   $scope.modify_keyword_mobile = document.getElementById('mnemonicMobileField').value;
                }
                if (document.getElementById('modifyMnemonicDisplayCheck').checked === true){
                   $scope.modify_keyword_dis = document.getElementById('mnemonicDisplayField').value;
                }
                if (document.getElementById('modifyMnemonicURLCheck').checked === true){
                   $scope.modify_keyword_url = document.getElemenyById('mnemonicURLField').value;
                }
                if (document.getElementById('modifyMnemonicLocCheck').checked === true){
                   $scope.modify_keyword_loc = document.getElementById('mnemonicNavigationField').value;
                }
                 if (document.getElementById('modifyMnemonicRelCheck').checked === true){
                   $scope.modify_keyword_rel = document.getElementById('mnemonicRelatedField').value;
                }
                
                
                
                 
                // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();


                // push local variable   
                QA.push({action: "Modify", sub: "Settings", id: "", name: $scope.modify_keyword_name, category: $scope.modify_keyword_cate, url: "mnemonicInfo", time: time});
                
               
                
                // then push the new list
                // dataTransfer.setQA(QA);
    
                // redraw the table
                
                // toggle the model
                   $('#modifyMnemonicModal').modal('toggle'); 
            };  
         
         
         $scope.deleteModal = function() {
                  // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
                // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();
                
                // then push the deleted mnemonic(s) locally

                //    alert($scope.mnemonicEditList[i].name); // debug
                 QA.push({action: "Delete", sub: "", id: "mnemonic.id", name: $scope.name, category: "", url: "", time: time});
            

                // then push the new list
                //dataTransfer.setQA(QA);
                
                // redraw the table
    
                $('#deleteMnemonicModal').modal('toggle'); // toggle the model
                
        };
            
            
            
	});
        
	configApp.controller('publishHistoryController', function($scope, dataTransfer) {
		
                $scope.publishList = [
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Horger, M", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Horger, M", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Horger, M", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Horger, M", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"},
                    {dest:"prod", desc: "publish", user: "Kraft, C", time: "10.2.14"}
                ];
                
	});
        
        configApp.controller('checkoutController', function($scope, dataTransfer) {
		
                $scope.cart = dataTransfer.getPRD();
                
	});



        configApp.service('dataTransfer', function() {
            
            var date;
            var QAchangeList = [];
            var PRDchangeList = [];
            
            this.setDate = function() {
              date = new Date();
            };
            
            this.getDate = function() {
                return date.toUTCString(); 
            };
            
            this.clearDate = function() {
                date = "";
            };
            
            this.setQA = function(x) {
                QAchangeList = x;
            };
            
            this.setPRD = function(x) {
                PRDchangeList = x;
            };
            
            this.getQA = function () {
                return QAchangeList;
            };
            
            this.getPRD = function() {
                return PRDchangeList;
            };
           
            
            
            
            
            
        });
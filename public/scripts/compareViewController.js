configApp.controller('compareViewController', function($scope, dataTransfer) {

$(document).ready( function () {
    $('#compareTable').DataTable( {
        "scrollY":        "580px",
        "scrollCollapse": true,
        "paging":         false,
        "searching": false
    });
    $('#enabled_packages_modal').DataTable({
            searching: false,
            lengthChange: false,
            pageLength: 5
    });
    $('#enabled_mnemonics_modal').DataTable({
            searching: false,
            lengthChange: false,
            pageLength: 5
    });


});


        var localList = dataTransfer.getCompare();
        $scope.compareList = localList;
        $scope.tempKeyList = [];
        $scope.dataList = [];
        $scope.mnemonicAddList = [];
        $scope.packageAddList = [];
        $scope.copyList = [];
        var currentMnemonic = {name: "", cate: "", navi: "", cap: "", mobile: "", dis: "", url: "", loc: "", rel: ""};
        var currentPackage = {name: "", id: "", desc: "", base: "", cate: ""};
            
    
    
        
        // these need to be api calls
        $scope.fullPackages = [
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
          
          // these need to be api calls
        $scope.fullMnemonics = [
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
            
        $scope.copyObjectList = [];
        $scope.copyFullList = [
                {name: 'about_mobile', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'},
                {name: 'benefits', display: 'My Benefits Overview', packages: '5', updated: '04/12/2017'}
            ];
        
        
        // function that generates our data for the table
        $scope.generateTable = function() {
            
            
          if($scope.compareList.length >= 1){ // if we have elements to compare 
            var val = $scope.compareList[0];
            for(var j in val){
                var sub_key = j;
                var sub_val = val[j];
                $scope.tempKeyList.push(sub_key); // get the keys
            //console.log(sub_key);
            }   

            for(var i = 0; i < $scope.tempKeyList.length; i++){
                var key = $scope.tempKeyList[i];
                var temp = [];
                //console.log(key);
                for(var b = 0; b < $scope.compareList.length; b++){
                    //console.log($scope.compareList[b][key]);
                    temp.push($scope.compareList[b][key]); // and populate the values for each object
                }
                $scope.dataList.push( {
                    key: key,
                    fields: temp
                });
            //console.log($scope.dataList);
            }
        } else // else we have nothing
            $scope.dataList = [];
        };
        
        $scope.checkButtons = function () {
            // we need to disable mnemonic add for packages
            if($scope.tempKeyList.length <= 10 && $scope.tempKeyList.length !== 0){
                document.getElementById("mnemonicButton").disabled = true;
            } else if($scope.tempKeyList.length >= 10 && $scope.tempKeyList.length !== 0){
                document.getElementById("packageButton").disabled = false;
            }
        };
     
        // function that removes the element from the compare list    
        $scope.removeList = function (index) {
           // alert($scope.compareList.length);
           //  alert(index);
            // use filter to find the package using the id and get it out of the array by returning everything but it
                    if($scope.compareList.length <= 1){
                         $scope.compareList = [];
                     //    alert($scope.compareList.length); debug purposes
                    } else {
                    
                    $scope.compareList.splice(index, 1);
                    // alert($scope.compareList.length);
                    
                    // need to redraw the table
            }            
                    
        };
        
        // function that is called when we want to clear the data list
        $scope.clearCompare = function () {
            location.reload();
            $scope.compareList = [];
            $scope.dataList = [];
        };
        
        // function that gets mnemonic check data for adding mnemonic to compare
         $scope.getMnemonicCheckData = function(name) {
                if((document.getElementById(name + '-box')).checked){
                    // we need to call the api for each sub-field of the mnemonic
                    currentMnemonic.name = name;
                    currentMnemonic.cate = "test";
                    currentMnemonic.navi = "abc";
                    currentMnemonic.cap = "aha";
                    currentMnemonic.mobile = "test";
                    currentMnemonic.dis = "repo";
                    currentMnemonic.url = "adi.pdf";
                    currentMnemonic.loc = "home";
                    currentMnemonic.rel = "";
                    $scope.mnemonicAddList.push(
                            {name: currentMnemonic.name, cate: currentMnemonic.cate, navi: currentMnemonic.navi, 
                            cap: currentMnemonic.cap, mobile: currentMnemonic.mobile, dis: currentMnemonic.dis,
                            url: currentMnemonic.url, loc: currentMnemonic.loc, rel: currentMnemonic.rel});
                    // push the mnemonic to the list if its checked
        
                } else {
                    if($scope.mnemonicAddList.length <= 1){
                         $scope.mnemonicAddList = []; // reset the list if there isn't a mnemonic
                     //    alert($scope.mnemonicAddList.length); debug purposes
                    } else {
                    
                    var index = $scope.mnemonicAddList.indexOf(currentMnemonic.name); // else remove the check
                    $scope.mnemonicAddList.splice(index, 1);
                }
            }
        
        
             
            
            $('#addPackageModal').modal('toggle');
        };

        // function that adds a mnemonic to the data list
        $scope.addMnemonic = function () {
            
            for(var i = 0; i < $scope.mnemonicAddList.length; i++){
                $scope.compareList.push($scope.mnemonicAddList[i]);
                console.log($scope.mnemonicAddList[i]);
                console.log($scope.compareList.length);
            }
            
            
            $('#addMnemonicModal').modal('toggle');
        };
                
        // function that searches a given term in the list of mnemonics
        $scope.searchPackages = function () {
             
            
            alert(document.getElementById('packagesearchBox').value);
        };

        // function that searches the list of mnemonics
        $scope.searchMnemonics = function () {
             
            
            alert(document.getElementById('mnemonicsearchBox').value);
        };
        
        // function for copy all to search for mnemonics
        $scope.searchAll = function () {
             
            
            alert(document.getElementById('allsearchBox').value);
        };
        
        $scope.copy = function (index){;
            console.log($scope.compareList[index]);
            $scope.currentObject = $scope.compareList[index].name;
        };
        
        // function that copies the one selected object features to others
        $scope.confirmCopy = function () {
            

             // have to refresh the QA changes list locally
                var QA = dataTransfer.getQA();
                    
                // set the change time;
                dataTransfer.setDate();
                    
                // get the time locally
                var time = dataTransfer.getDate();
               // alert(time); // debug only
                // clear the service data
                dataTransfer.clearDate();

                // push the list locally
                for(var i = 0; i < $scope.copyList.length; i++){
                    
                    QA.push({action: "Copy", sub: "Visibility", id: "", name: $scope.mnemonicEditList[i].name, category: $scope.mnemonicEditList[i].cate, desc: $scope.mnemonicEditList[i].dis, url: "packageInfo", time: time});
                
                }
                
                // then push the new list
                 dataTransfer.setQA(QA);
    
                // redraw the table
            
            $('#copyModal').modal('toggle');
            $location.path('/');
        };
        
        
        
        
        // function that moves one objeect over to copy list
        $scope.addCopy = function (name) {
            
            // need to copy over the object to the selected list
            $scope.copyObjectList.push(name);
            
            // then need to remove it from the full list
            if($scope.copyFullList.length <= 1){
                         $scope.copyFullList = [];
                } else {
                    var index = $scope.copyFullList.indexOf(name);
                    $scope.copyFullList.splice(index, 1);
                }
        };
        
        // function that removes one object from copy list
        $scope.removeCopy = function (name) {
            
            // need to copy over the object back to the full list
            $scope.copyFullList.push(name);
            
            // then need to remove it from the selected list
            if($scope.copyObjectList.length <= 1){
                $scope.copyObjectList = [];
            } else {
                var index = $scope.copyObjectList.indexOf(name);
                $scope.copyObjectList.splice(index, 1);
            }
        };
        
        $scope.updateCopy = function (name) {
            alert(name);
            
            // api call for the specific mnemonic to get all the info with the given index
            
           
        };
        
        $scope.updateSelectCopy = function (name){
            alert(name);
            
            // api call for the specific mnemonic to get all the info with the given index
            
        };

        /// before reload, save the local change lists
        window.onbeforeunload = function() {
          sessionStorage.setItem('compare', JSON.stringify($scope.compareList));
        };
        
        $scope.load = function() {
         var compareConnection = sessionStorage.getItem('compare');
           // alert(name); // debug
            var compareParse = jQuery.parseJSON(compareConnection);
           // console.log(comapreParse); // debug
           
           if(compareParse !== null){
               dataTransfer.setCompare(compareParse);
            } else {
                dataTransfer.setCompare([]);
            }
        };
        
         window.onload =  $scope.load();
         
});
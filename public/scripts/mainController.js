configApp.controller('mainController', function($scope, $location, dataTransfer) {
    // function that gets called on unload
    $(window).on("unload", function(e) {
        console.log("store local lists into storage");
        sessionStorage.setItem('qa', JSON.stringify($scope.QAchangesList)); // stores the lists into sessionstorage on page reload
       
        /* AJAX call for QA changes ready for PRD storage
         * $.ajax({
               type: 'GET',
               url: "https://www3.septa.org/hackathon/elevator/",
               processData: true,
               crossDomain: true,
               data: {},
               dataType: "json",
               success: function (data) {
                   $scope.PRDchangesList = data;
               }
        });
        */
    });
    // function that gets called when the page loads
    $(document).ready(function() {
        var QAConnection = sessionStorage.getItem('qa'); // get whatever local objects are stored in sessionStorage
        var QAparse = jQuery.parseJSON(QAConnection); // parse them for json
        console.log(QAparse); // debug
        if(QAparse !== null) { // if the results aren't empty
            dataTransfer.setQA(QAparse); // save them into our angular service
        } else {
            dataTransfer.setQA([]);
        }
        $('#pending').DataTable({
            searching: false,
            lengthChange: false,
            pageLength: 8
        });
        
        $('#loading').hide(); // once the data is loaded, we need to hide the loading image

    });
    // end of document.ready, start defining scope functions
    // function that gets called whenever we click on a recently viewed page
    $scope.history = function(x) {
        var object = $scope.historyArray[x]; //set the local object variable to the position in the array
        $location.path(object.url + "/" + object.id); // change the path so that it redirects to the object
    };

    // function that gets called when we want to edit a change from the local QA list
    $scope.editChange = function(id, name, url) {
        console.log(id); // debug
        console.log(name);
        console.log(url); // debug
        if(url === "packageInfo") {
            $location.path(url + "/" + id); // redirect the path for each appropriate package / mnemonic
        } else if(url === "mnemonicInfo") {
            $location.path(url + "/" + name);
        } else $location.path("#"); // if for some reason the change isn't a package or mnemonic, keep the dashboard loaded
    };

    // function that gets called when we delete a change from the local list
    $scope.deleteChange = function(id) {
        if($scope.QAchangesList.length <= 1) { // if theres only one change
            $scope.QAchangesList = []; // we just clear out the list, no need to find it
            console.log($scope.QAchangesList.length); // debug purposes
        } else {

            var index = $scope.QAchangesList.indexOf(id); // find the index 
            $scope.QAchangesList.splice(index, 1); // and then splice the list with the index

        }
        $('#deleteChangesModal').modal('toggle'); // toggle the modal
        location.reload(); // refresh the page to save the local list and refresh the table
    };

    // function that redirects the angular path to the checkout page when the user clicks on the go to cart button
    $scope.goCart = function() {
        $location.path('/checkout');
    };


    // end of function declarations, start injecting content and logic       

    var QAstorage = dataTransfer.getQA(); // stores local list from angular service
    // essentially keeps changes shared across users
    $scope.QAchangesList = QAstorage;

    // create our recently viewed history array test data
    $scope.historyArray = [{
        url: "mnemonicInfo",
        id: "about_mobile"
    }, {
        url: "packageInfo",
        id: "12"
    }, {
        url: "mnemonicInfo",
        id: "benefits"
    }];

    if($scope.QAchangesList.length !== 0) { // if there is anything in the list
        document.getElementById('cartButton').disabled = false; // user can publish
    }


});
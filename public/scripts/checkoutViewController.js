configApp.controller('checkoutController', function($scope, $location, dataTransfer) {            
  
    $(window).on("unload", function(e) {
        console.log("store local lists into storage");
        sessionStorage.setItem('qa', JSON.stringify($scope.cart)); // stores the lists into sessionstorage on page reload
    }); 
    $(document).ready( function () {
        var QAConnection = sessionStorage.getItem('qa'); // get whatever local objects are stored in sessionStorage
        var QAparse = jQuery.parseJSON(QAConnection); // parse them for json
        if(dataTransfer.getQA() === null){
            if(QAparse !== null) { // if the results aren't empty
                dataTransfer.setQA(QAparse); // save them into our angular service
            } else {
                dataTransfer.setQA([]);
            }
        }
    $('#cart').DataTable({
        searching: false,
        lengthChange: false,
        pageLength: 12
    }); // initialize the datatable
     $('#loading').hide();
     dataTransfer.alertMerge();
});
// end of document.ready - declare functions
// function that is called when we want to publish changes
    $scope.publishQA = function () {

    /* AJAX call for QA changes ready for QA storage
        $.ajax({
            type: 'POST',
            url: "http://paea0003:4567/api/mnemonics/" + $scope.name + "/get",
            processData: true,
            crossDomain: true,
            data: $scope.cart,
            dataType: "json",
            success: function (data) {
                dataTransfer.setPublish(publish); // then push the new list
            }
        });
    */
    };
// function that redirects the view to the specific edit in the cart
    $scope.editChange = function(id, url, name){
            if(url === "packageInfo"){ // redirect to the appropriate change
            $location.url(url + "/" + id);
            } else if (url === "mnemonicInfo") {
            $location.url(url + "/" + name);
            }
            else $location.url("#"); // else for some reason just redirect to the dashboard
    };
                
// function that deletes a given change in the cart
    $scope.deleteChange = function(id) {
            if($scope.cart.length <= 1){ // if there's just one thing for QA
            $scope.cart = []; // just clear the list
            console.log($scope.cart.length);// debug purposes
            } else { 
            var index = $scope.cart.indexOf(id); // else we have to splice the list at an index
            $scope.cart.splice(index, 1);
            }
            dataTransfer.setQA($scope.cart); // then we have to set the QA list
            $('#deleteChangesModal').modal('toggle'); // toggle the modal
            location.reload(); // reload the page to fix the datatable
        };
        
// end of function declaration - inject content and logic
        $scope.cart = dataTransfer.getQA();          
        if($scope.cart.length !== 0){ // if something is in the cart
            document.getElementById('publishButton').disabled = false; // we can push the change
        }       
             
	});



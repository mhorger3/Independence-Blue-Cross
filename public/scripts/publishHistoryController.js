configApp.controller('publishHistoryController', function($scope, dataTransfer) {
    // function that gets called when the browser reloads / unloads
    $(window).on("unload", function(e) {
        console.log("store local lists into storage");
        sessionStorage.setItem('publish', JSON.stringify($scope.publishList));
        sessionStorage.setItem('qa', JSON.stringify(dataTransfer.getQA()));
    });
    // function that gets called when the browser loads
    $(document).ready(function() {
        var publishConnection = sessionStorage.getItem('publish'); // get whatever local objects are stored in sessionStorage
        var publishparse = jQuery.parseJSON(publishConnection); // parse them for json
        console.log(publishparse); // debug
        if(publishparse !== null) { // if the results aren't empty
            dataTransfer.setPublish(publishparse); // save them into our angular service
        } else {
            dataTransfer.setPublish([]);
        }
                
        var QAConnection = sessionStorage.getItem('qa'); // get whatever local objects are stored in sessionStorage
        var QAparse = jQuery.parseJSON(QAConnection); // parse them for json
        if(dataTransfer.getQA() === null){
            if(QAparse !== null) { // if the results aren't empty
                dataTransfer.setQA(QAparse); // save them into our angular service
            } else {
                dataTransfer.setQA([]);
            }
        }
        var table = $('#publishList').DataTable({ // initialize the datatable
            lengthChange: false,
            pageLength: 13
        }); 
        // Add event listener for opening and closing details
        $('#publishList').on('click', 'td.details-control', function() {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            if(row.child.isShown()) { // if the child row is open already
                row.child.hide(); // This row is already open - close it
                tr.removeClass('shown');
            } else {
                row.child(format(tr.data('child-value'))).show(); // Open this row - load the data into the view
                tr.addClass('shown');
            }
        });
    });
    // function declarations
    // this function will format our child datatable rows
    function format(value) {
        return '<div>Change: ' + value + '</div>';
    }
    // this function is called upon whenever you hit the search button
    $scope.searchPublishes = function() {
        console.log(document.getElementById('publishsearchBox').value); // alert whatever we are searching for debug
        location.reload(); // then reload so the document.ready function can set the publish list
    };
    // communication test function
    $scope.test = function() {
        alert("test");
        console.log("test");
    };
    // inject content
    $scope.publishList = dataTransfer.getPublish();

});
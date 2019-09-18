$(function() {
    $('.popers').poper({
            theme: 'blue',
            size: 'mid',
            headerText: "Poper By PHP",
            content: "http://192.168.4.218/plugins/poper/test.php",
            remote: true
        })
        .on('poper.show', function(event) {
            console.log("Poper Show");
        })
        .on('poper.hide', function(event) {
            console.log("Poper hide");
        })
        .on('poper.showing', function(event) {
            console.log("Poper Showing");
        })
        .on('poper.hiding', function(event) {
            console.log("Poper Hiding");
        })
    $('.popers_1').poper({
            theme: 'blue',
            size: 'small',
            headerText: "Poper By HTML",
            content: "http://192.168.4.218/plugins/poper/test.html",
            remote: true
        })
    $('[data-poper="true"]').on('poper.hide', function(event) {
        console.log('[data-poper="true"] Closed');
    })
})
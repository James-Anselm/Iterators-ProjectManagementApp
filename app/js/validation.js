
  $('document').ready(
    function () { 

      var validate_name = function (element) {
        console.log($(element)[0].attr('id'));
        element.attr('placeholder', 'Noo');
      };

      //console.log($("input,select,textarea").not("[type=submit]"));
      //$("input,select,textarea").not("[type=submit]").jqBootstrapValidation(); 
      console.log($('#registerName'));
      validate_name($('#registerName'));
    } 
  );
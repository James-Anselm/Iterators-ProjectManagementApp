'use strict'

function DashboardCtrl($scope, $location){

}

function LoginCtrl($scope, $location) {

  $scope.loginUser = function(loginCredentials) {
    Parse.User.logIn(loginCredentials.username, loginCredentials.password, {
      success: function(user) {
        // Do stuff after successful login.
        $scope.$apply(function(){
          $location.path('/dashboard');
        });
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  $scope.registerUser = function() {
    $location.path('/register');
  }
}

function RegisterCtrl($scope, $location) {
  var user = new Parse.User(); 

  $scope.registerUser = function(register){
    var error;
    if(register) {
      if(register.name)
       user.set("name", register.name);
      if(register.password && register.confirmPassword && register.password.length > 5 && register.password == register.confirmPassword)
       user.set("password", register.password);
      else
       error = "the password entries weren't valid."
      if(register.email) {
       user.set("email", register.email);
       user.set("username", register.email);
      }
      else
       error = "the email entry wasn't valid."
    }
    else {
      error = "please fill in the registration form";
    }

    if(!error) {
      user.signUp(null, {
        success: function(user) {
           $scope.$apply(function(){
              $location.path('/dashboard');
           });
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      }); 
    }
    else
      alert(error);
  } 

  $scope.toDashboard = function() {
    $location.path('/dashboard');
    $('#register_page1').removeClass('inactive');
    $('#register_page2').addClass('inactive');
    $('#register_page3').addClass('inactive');
  }

  $scope.toCreateProject = function() {
    $location.path('/createProject');
    $('#register_page1').removeClass('inactive');
    $('#register_page2').addClass('inactive');
    $('#register_page3').addClass('inactive');
  }
}

function CreateProjectCtrl($scope, $location){

}

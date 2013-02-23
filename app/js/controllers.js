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
  $scope.registerUser_page1 = function(register1){
    var error;
    if(register1) {
      if(register1.firstName)
       user.set("firstName", register1.firstName);
      if(register1.lastName)
       user.set("lastName", register1.lastName);
      if(register1.password && register1.confirmPassword && register1.password.length > 5 && register1.password == register1.confirmPassword)
       user.set("password", register1.password);
      else
       error = "the password entries weren't valid."
      if(register1.email && register1.confirmEmail && register1.email == register1.confirmEmail) {
       user.set("email", register1.email);
       user.set("username", register1.email);
      }
      else
       error = "the email entries weren't valid."
    }
    else {
      error = "please fill in the registration form";
    }
    if(!error){
      $('#register_page1').addClass('inactive');
      $('#register_page2').removeClass('inactive');
      $('#register_page3').addClass('inactive');
    }
    else {
      alert(error);
    }
  } 

  $scope.registerUser_page2 = function(register2) {
    var error;
    if(register2.travelTime && Number(register2.travelTime) > 0 && Number(register2.travelTime) < 24)
      user.set("travelTime", Number(register2.travelTime));
    else
      error = "travel time is invalid";
    if(register2.sleepTime && Number(register2.sleepTime) > 0 && Number(register2.sleepTime) < 24)
      user.set("sleepTime", Number(register2.sleepTime));
    else
      error = "sleep time is invalid";
    if(register2.eatingTime && Number(register2.eatingTime) > 0 && Number(register2.eatingTime) < 24)
      user.set("eatingTime", Number(register2.eatingTime));
    else
      error = "eating time is invalid";
    if(register2.personalTime && Number(register2.personalTime) > 0 && Number(register2.personalTime) < 24)
      user.set("personalTime", Number(register2.personalTime));
    else
      error = "personal time is invalid";
    if(register2.otherTime && Number(register2.otherTime) > 0 && Number(register2.otherTime) < 24)
      user.set("otherTime", Number(register2.otherTime));
    else
      error = "other time is invalid";

    if(!error) {
      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
           $scope.$apply(function(){
             $('#register_page1').addClass('inactive');
             $('#register_page2').addClass('inactive');
             $('#register_page3').removeClass('inactive');
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
    $('#register_page1').removeClass('inactive');
    $('#register_page2').addClass('inactive');
    $('#register_page3').addClass('inactive');
    $location.path('/dashboard');
  }

  $scope.toCreateProject = function() {
    $('#register_page1').removeClass('inactive');
    $('#register_page2').addClass('inactive');
    $('#register_page3').addClass('inactive');
    $location.path('/createProject');
  }
}

function CreateProjectCtrl($scope, $location){

}







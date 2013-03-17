'use strict'

function DashboardCtrl($scope, $location){
  $scope.logout = function() {
    Parse.User.logOut();
    $location.path("/login");
  }

  $scope.createProject = function() {
    $location.path('/createproject');
  }

  $scope.createMilestone = function() {
    $location.path('/createmilestone');
  }

$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            title: {
                text: 'Milestones Chart'
            },
            xAxis: {
                categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week ']
            },
            tooltip: {
                formatter: function() {
                    var s;
                    if (this.point.name) { // the pie chart
                        s = ''+
                            this.point.name +': '+ this.y +' fruits';
                    } else {
                        s = ''+
                            this.x  +': '+ this.y;
                    }
                    return s;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            labels: {
                items: [{
                    html: 'label',
                    style: {
                        left: '40px',
                        top: '8px',
                        color: 'black'
                    }
                }]
            },
            series: [{
                type: 'column',
                name: 'Project1',
                data: [3, 2, 1, 3, 4]
            }, {
                type: 'column',
                name: 'Project2',
                data: [2, 3, 5, 7, 6]
            }, {
                type: 'column',
                name: 'Project3',
                data: [4, 3, 3, 9, 0]
            }, {
                type: 'spline',
                name: 'Projected Workload',
                data: [10, 9, 3, 6.33, 9],
                marker: {
                  lineWidth: 2,
                  lineColor: Highcharts.getOptions().colors[3],
                  fillColor: 'white'
                }
            },]
        });
    });
    
});


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

  var projectObj = Parse.Object.extend("Project");
  var newProject = new projectObj();

  $scope.createProject = function(project){
    var error;
    if(project) {
      if(project.name)
       newProject.set("Name", project.name);
      else
       error = "please enter a valid project name";
      if(project.description)
       newProject.set("Description", project.name);
      if(project.start)
        newProject.set("StartWeek", parseWeekInput(project.start));
      if(project.end)
        newProject.set("EndWeek", parseWeekInput(project.end));
      newProject.relation("User").add(Parse.User.current());
    }
    else {
      error = "please fill in the create project form";
    }

    if(!error) {
      newProject.save(null, {
        success: function(newProject) {
           $scope.$apply(function(){
              $location.path('/dashboard');
           });
        },
        error: function(newProject, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      }); 
    }
    else
      alert(error);
  } 
}

//week input is in the form "YYYY-WXX". Convert it to an object with integers.
function parseWeekInput(weekInput) {
  return {
    year: parseInt(weekInput.substring(0,4)),
    week: parseInt(weekInput.substring(6))
  }
}


function CreateMilestoneCtrl($scope, $location){

  var projectObj = Parse.Object.extend("Milestone");
  var newMilestone = new projectObj();

  var projectQuery = new Parse.Query("Project");
  projectQuery.equalTo("User", Parse.User.current());
  projectQuery.find({
    success: function(projects){
               $scope.$apply(function() {
                 $scope.projects = projects;
               });
             }
  });

  $scope.createMilestone = function(milestone){
    var error;
    if(milestone) {
      if(milestone.name)
       newMilestone.set("Name", milestone.name);
      else
       error = "please enter a valid milestone name";
      if(milestone.description)
       newMilestone.set("Description", milestone.name);
      if(milestone.week)
        newMilestone.set("Week", parseWeekInput(milestone.week));
      if(milestone.weight)
        newMilestone.set("Weight", milestone.weight);
      newMilestone.relation("User").add(Parse.User.current());
      newMilestone.relation("Project").add(milestone.project);
    }
    else {
      error = "please fill in the create milestone form";
    }

    if(!error) {
      newMilestone.save(null, {
        success: function(newMilestone) {
           $scope.$apply(function(){
              $location.path('/dashboard');
           });
        },
        error: function(newMilestone, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      }); 
    }
    else
      alert(error);
  } 
}

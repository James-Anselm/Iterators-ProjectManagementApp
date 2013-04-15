'use strict'

function DashboardCtrl($scope, $location){

  //the chart for displaying milestone data for projects.
  var chart;
  $scope.parse_milestones = [];
  var weeks = [];
  var milestones = [];
  var projects = [];
  var milestoneQueryCompleted = false;
  var projectQueryCompleted = false;

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

  function getAllMilestones() {
    milestoneQueryCompleted = false;
    var milestoneQuery = new Parse.Query("Milestone");
    milestoneQuery.equalTo("UserID", Parse.User.current().id);
    milestoneQuery.find({
      success: function(milestones){
                 $scope.$apply(function() {
                   $scope.parse_milestones = milestones;
                   milestoneQueryCompleted = true;
                   postQuerying();
                 });
               }
    });
  }

  function getAllProjects() {
    projectQueryCompleted = false;
    var projectQuery = new Parse.Query("Project");
    projectQuery.equalTo("UserID", Parse.User.current().id);
    projectQuery.find({
      success: function(projects){
                 $scope.$apply(function() {
                   $scope.parse_projects = projects;
                   projectQueryCompleted = true;
                   postQuerying();
                 });
               }
    });
  }

  function postQuerying() {
    if(milestoneQueryCompleted && projectQueryCompleted) {
      processMilestones();
    }
  }

  function processMilestones() {
    setWeeksArray();
    getProjectsFromMilestones();
    populateMilestoneArrays();
    initializeChart();
  }

  function populateMilestoneArrays() {
    for(var i=0; i<$scope.parse_milestones.length; i++){
      var weekStr = week_numToString( week_objToNum( $scope.parse_milestones[i].get("Week") ) );
      var projectID = $scope.parse_milestones[i].get("ProjectID");
      for(var j=0; j<weeks.length; j++){
        if(weekStr == weeks[j]){
          for(var k=0; k<projects.length; k++) {
            if(projects[k].projectID == projectID) {
              projects[k].milestones[j] += $scope.parse_milestones[i].get("Weight");
              projects[k].milestoneNames[weekStr] = $scope.parse_milestones[i].get("Name");
              break;
            }
          }
        break;
        }
      }
    }
  }

  function setWeeksArray() {
    var range = getWeekRange();
    weeks = [];
    for(var i=0; i<=(range.high-range.low); i++) {
      weeks.push( week_numToString(range.low+i) );
    }
  }

  function week_numToString(weekNum){
    return "W" + weekNum%52 + " Y" + parseInt( (weekNum/52) );
  }

  function week_stringToNum(weekStr){
    var week = parseInt( weekStr.match(/W([^}]*) /)[1] ) + 52*parseInt( test2.match( /Y(.*)/ )[1] );
  }

  function week_objToNum(weekObj) {
    return weekObj.year*52 + weekObj.week;
  }

  function getWeekRange() {
    var range = {low: -1, high: -1};
    for(var i=0; i<$scope.parse_milestones.length; i++) {
      var weekNumber = week_objToNum($scope.parse_milestones[i].get("Week"));
      if(weekNumber < range.low || range.low < 0) {
        range.low = weekNumber;
      }
      if(weekNumber > range.high) {
        range.high = weekNumber;
      }
    }
    return range;
  }

  function getProjectsFromMilestones() {
    projects = [];
    
    for(var i=0; i<$scope.parse_milestones.length; i++){
      var projectID = $scope.parse_milestones[i].get("ProjectID");
      var added = false;
      for(var k=0; k<projects.length; k++) {
        if(projects[k].projectID == projectID) {
          added = true;
          break;
        }
      }
      if(!added) {
        var newArray = new Array(weeks.length);
        for(var j=0; j<newArray.length; j++) {
          newArray[j] = 0;
        }
        var projectName;
        for(var k=0; k<$scope.parse_projects.length; k++) {
          if($scope.parse_projects[k].id == projectID) {
            projects.push({projectID: projectID, name: $scope.parse_projects[k].get("Name"), milestones: newArray, milestoneNames: []});
            break;
          }
        }
      }
    }
  }

  function initializeChart() {
    var series = [];
    for(var i=0; i<projects.length; i++) {
      series.push({type: 'column', name: projects[i].name, projectId: projects[i].projectID, data: projects[i].milestones, milestoneNames: projects[i].milestoneNames});
    }

    chart = new Highcharts.Chart({
      chart: {
        renderTo: 'container'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: weeks,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        labels: {
          enabled: false 
        },
        title: {
          enabled: false
        }
      },
      tooltip:{
        formatter: function() {
          var s = 'Project: <b>'+ this.series.name + '</b><br>' + 
                  'Milestone: <b>' + this.series.options.milestoneNames[this.key] + '</b><br>' +
                  'Date: <b>' + this.key + '</b><br>';
          return s;
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            //enabled: true,
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
          }
        }
      },
      labels: {
        items: [{
          style: {
            left: '40px',
            top: '8px',
            color: 'black'
          }
        }]
      },
      series: series
    });//end new chart line.
  }//end initializeChart()

  $(function () {
    $(document).ready(function() {
      getAllMilestones();
      getAllProjects();
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
      newProject.set("UserID", Parse.User.current().id);
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
  projectQuery.equalTo("UserID", Parse.User.current().id);
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
      newMilestone.set("UserID", Parse.User.current().id);
      newMilestone.set("ProjectID", milestone.project.id);
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

var myApp = angular.module("AllowaAPP", ['ngRoute', 'firebase']);

var config = {
    // Initialize Firebase
    apiKey: "AIzaSyBHFzhx4ynk6nDox_f05fdPY3K_af0LiFg",
    authDomain: "s2homes-allowa.firebaseapp.com",
    databaseURL: "https://s2homes-allowa.firebaseio.com/",
    projectId: "s2homes-allowa",
    storageBucket: "",
    messagingSenderId: "419261413661"
};

firebase.initializeApp(config);

myApp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
        .when('/', {
            templateUrl: 'pages/Summary.html',
            controller: 'summaryController'
        })

        .when('/Summary', {
            templateUrl: 'pages/Summary.html',
            controller: 'summaryController'
        })

        .when('/Owners', {
            templateUrl: 'pages/Owners.html',
            controller: 'plotownersController'
        })

        .when('/Maintenance', {
            templateUrl: 'pages/Maintenance.html',
            controller: 'maintenanceController'
        })

        .when('/CorpusFund', {
            templateUrl: 'pages/CorpusFund.html',
            controller: 'corpusController'
        })

        .when('/CorpusFundDetails', {
            templateUrl: 'pages/OwnerPaymentDetails.html',
            controller: 'corpusDetailsController'
        })

        .when('/CorpusFundExpenses', {
            templateUrl: 'pages/Expenses.html',
            controller: 'corpusFundExpensesController'
        })

        .when('/Admin', {
            templateUrl: 'pages/Admin.html',
            controller: 'adminController'
        })

        .when('/CASites', {
            templateUrl: 'pages/CASites.html',
            controller: 'caSitesController'
        })

        .when('/CASiteDetails', {
            templateUrl: 'pages/OwnerPaymentDetails.html',
            controller: 'caSitesDetailsController'
        })

        .when('/CASiteExpenses/:month', {
            templateUrl: 'pages/Expenses.html',
            controller: 'caSitesExpensesController'
        })

        .when('/Login', {
            templateUrl: 'pages/Login.html',
            controller: 'loginController'
        })

        .when('/Maintenance/:month', {
            templateUrl: 'pages/OwnerPaymentDetails.html',
            controller: 'maintenanceDetailsController'
        })

        .when('/MaintenanceExpenses/:month', {
            templateUrl: 'pages/Expenses.html',
            controller: 'maintenanceExpensesController'
        })
});

angular.module('AllowaAPP')
    .config(function ($httpProvider, $httpParamSerializerJQLikeProvider) {
        $httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    });

myApp.controller("adminController", function ($scope, $firebaseObject) {
    console.log("Inside adminController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    $('#CACorpusFundDetails').hide();
    $('#MaintenanceDetails').hide();
    $('#CorpusFundExpenses').hide();
    onPageLoad("Admin");

    var email = sessionStorage.getItem("email");
    if (email) {
        if (email.localeCompare('krishna.pomar@gmail.com') == 0) {
            console.log('Admin');
            $('#adminForm').show();
            $('#errorMessage').hide();
        }
        else {
            $scope.unAuthorizedMessage = "You are not an Admin !!!"
            $('#adminForm').hide();
        }
    }
    else {
        $('#adminForm').hide();
        $scope.unAuthorizedMessage = "You are not an Admin !!!"
    }

    var dbRef = firebase.database().ref().child('OwnerDetails');
    $scope.ownersList = $firebaseObject(dbRef);
    $scope.ownersList.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
    });

    var corpusRef = firebase.database().ref().child('CorpusFundDetails');
    var caFundRef = firebase.database().ref().child('CASiteFundDetails');
    var maintRef = firebase.database().ref().child('Maintenance');

    $scope.updateFundDetails = function (item) {
        corpusRef.child(item.ownerAccountNo).set({
            paidAmount: item.corpusPaid,
            pendingAmount: item.corpusPending
        });
        caFundRef.child(item.ownerAccountNo).set({
            paidAmount: item.casitePaid,
            pendingAmount: item.casitePending
        });
        alert("Successfully updated : " + item.ownerAccountNo + "CA Site & Corpus Fund details!");
    };

    $scope.updateMaintDetails = function (item) {
        maintRef.child(item.forMonth).child(item.ownerAccountNo).set({
            paidAmount: item.maintPaid,
            pendingAmount: item.maintPending
        });
        alert("Successfully updated : " + item.ownerAccountNo + " maintenance details!");
    };

    $scope.showHideCACorpusFundDetails = function () {
        if ($('#CACorpusFundDetails').is(':visible')) {
            $('#CACorpusFundDetails').hide();
        }
        else {
            $('#CACorpusFundDetails').show();
        }
    }

    $scope.maintenanceDetails = function () {
        if ($('#MaintenanceDetails').is(':visible')) {
            $('#MaintenanceDetails').hide();
        }
        else {
            $('#MaintenanceDetails').show();
        }
    }

    $scope.showHideCorpusFundExpensesDetails = function () {
        if ($('#CorpusFundExpenses').is(':visible')) {
            $('#CorpusFundExpenses').hide();
        }
        else {
            $('#CorpusFundExpenses').show();
        }
    }

    var corpusExpensesRef = firebase.database().ref().child('CorpusFundExpenses');

    $scope.corpusFundExpense = function (item) {
        var expenseDate = item.date.getDate() + "/" + item.date.getMonth() + "/" + item.date.getFullYear();
        corpusExpensesRef.push({
            ExpenseAmount: item.expenseAmount,
            ExpenseType: item.expenseType,
            Date: expenseDate
        });
        alert("Successfully updated : " + item.ownerAccountNo + "Corpus Fund Expenses!");
    };
});

myApp.controller("maintenanceController", function ($scope, $window, $firebaseObject) {
    console.log("Inside maintenanceController");

    $('#spinner').show();
    onPageLoad("Maintenance");
    var dbRef = firebase.database().ref().child('MaintenanceSummary');
    $scope.maintExpensesSummary = $firebaseObject(dbRef);
    $scope.maintExpensesSummary.$loaded().finally(function () {
        $('#spinner').hide();
    });

    $scope.maintSummaryClick = function (month) {
        $window.location.href = "/Maintenance/" + month;
    };

    $scope.maintExpensesClick = function (month) {
        $window.location.href = "/MaintenanceExpenses/" + month;
    };
});

myApp.controller("maintenanceExpensesController", function ($scope, $routeParams, $firebaseObject) {
    console.log("Inside maintenanceExpensesController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    onPageLoad("Maintenance");

    $scope.totalExpenses = 0;
    var forMonth = $routeParams.month;
    var dbRef = firebase.database().ref().child('MaintenanceExpenses').child(forMonth);
    $scope.expenses = $firebaseObject(dbRef);
    $scope.expenses.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
    });
    var totalExpensesRef = firebase.database().ref('MaintenanceSummary').child(forMonth).child('TotalSpent');
    totalExpensesRef.on('value', function (snapshot) {
        $scope.totalExpenses = snapshot.val();
        $scope.$apply();
    });
});

myApp.controller("maintenanceDetailsController", function ($scope, $routeParams, $firebaseObject) {
    console.log("Inside maintenanceDetailsController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    onPageLoad("Maintenance");

    var forMonth = $routeParams.month;

    var ownerDetailsRef = firebase.database().ref().child('OwnerDetails');
    var maintRef = firebase.database().ref().child('Maintenance').child(forMonth);

    $scope.ownerDetails = $firebaseObject(ownerDetailsRef);
    var maintenanceDetails = $firebaseObject(maintRef);
    
    $scope.ownerDetails.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
        $scope.ownerDetails.forEach(function (item) {
            if (maintenanceDetails[item.ownerAccountNo]) {
                item.paidAmount = maintenanceDetails[item.ownerAccountNo].paidAmount;
                item.pendingAmount = maintenanceDetails[item.ownerAccountNo].pendingAmount;
            }
            else {
                item.paidAmount = 0;
                item.pendingAmount = -1;
            }
        });
    });

    maintRef.on('value', function (snapshot) {
        maintenanceDetails = snapshot.val();
        $scope.ownerDetails.forEach(function (item) {
            if (maintenanceDetails[item.ownerAccountNo]) {
                item.paidAmount = maintenanceDetails[item.ownerAccountNo].paidAmount;
                item.pendingAmount = maintenanceDetails[item.ownerAccountNo].pendingAmount;
            }
            else {
                item.paidAmount = 0;
                item.pendingAmount = -1;
            }
        });
    });

    //$('#notPaidCheckBox').on('change', function () {
    //    var newContent = [];
    //    if (this.checked) {
    //        finalMaintenanceList.forEach(function ($item) {
    //            if ($item.maintenance) {
    //                if ($item.maintenance.toLowerCase().includes("not paid")) {
    //                    newContent.push($item);
    //                }
    //            }
    //        });
    //        $scope.maintenanceDetails = newContent;
    //    }
    //    else {
    //        $scope.maintenanceDetails = finalMaintenanceList;
    //    }
    //    $scope.$apply();
    //});
});

myApp.controller("corpusController", function ($scope, $window) {
    console.log("Inside corpusController");
    $('#spinner').show();
    $('#bodyContainer').hide();

    onPageLoad("Corpus Fund");

    var totalCorpusFundRef = firebase.database().ref('Summary').child('CorpusFund');
    
    $scope.receivedBtnClick = function () {
        $window.location.href = "/CorpusFundDetails";
    };

    $scope.corpExpensesClick = function () {
        $window.location.href = "/CorpusFundExpenses";
    };
});

myApp.controller("corpusDetailsController", function ($scope, $firebaseObject) {
    console.log("Inside corpusDetailsController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    onPageLoad("Corpus Fund");

    var ownerDetailsRef = firebase.database().ref().child('OwnerDetails');
    var corpusRef = firebase.database().ref().child('CorpusFundDetails');

    $scope.ownerDetails = $firebaseObject(ownerDetailsRef);
    var corpusDetails = $firebaseObject(corpusRef);

    $scope.ownerDetails.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
        $scope.ownerDetails.forEach(function (item) {
            if (corpusDetails[item.ownerAccountNo]) {
                item.paidAmount = corpusDetails[item.ownerAccountNo].paidAmount;
                item.pendingAmount = corpusDetails[item.ownerAccountNo].pendingAmount
            }
            else {
                item.paidAmount = 0;
                item.pendingAmount = -1;
            }
        });
    });

    corpusRef.on('value', function (snapshot) {
        corpusDetails = snapshot.val();
        $scope.ownerDetails.forEach(function (item) {
            if (corpusDetails[item.ownerAccountNo]) {
                item.paidAmount = corpusDetails[item.ownerAccountNo].paidAmount;
                item.pendingAmount = corpusDetails[item.ownerAccountNo].pendingAmount
            }
            else {
                item.paidAmount = 0;
                item.pendingAmount = -1;
            }
        });
    });

    //$('#notPaidCheckBox').on('change', function () {
    //    var newContent = [];
    //    if (this.checked) {
    //        finalCorpusFundsList.forEach(function ($item) {
    //            if ($item.corpusFund.toLowerCase().includes("not paid")) {
    //                newContent.push($item);
    //            }
    //        });
    //        $scope.corpusFundDetails = newContent;
    //    }
    //    else {
    //        $scope.corpusFundDetails = finalCorpusFundsList;
    //    }
    //    $scope.$apply();
    //});
});

myApp.controller("corpusFundExpensesController", function ($scope, $firebaseObject) {
    console.log("Inside corpusFundExpensesController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    onPageLoad("Corpus Fund");

    $scope.totalExpenses = 0;
    var dbRef = firebase.database().ref().child('CorpusFundExpenses');
    $scope.expenses = $firebaseObject(dbRef);
    $scope.expenses.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
    });
});

myApp.controller("caSitesController", function ($scope, $window, $firebaseObject) {
    console.log("Inside caSitesController");

    $('#spinner').show();
    $('#bodyContainer').hide();

    onPageLoad("CA-Sites");
    var dbRef = firebase.database().ref().child('CASiteSummary');
    $scope.caSiteExpensesSummary = $firebaseObject(dbRef);
    $scope.caSiteExpensesSummary.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
    });

    var totalCAFundReceivedRef = firebase.database().ref('Summary').child('CA-Sites').child('TotalReceived');
    totalCAFundReceivedRef.on('value', function (snapshot) {
        $scope.totalCAFundReceived = snapshot.val();
        $scope.$apply();
    });

    $scope.receivedBtnClick = function () {
        $window.location.href = "/CASiteDetails";
    };

    $scope.caSiteExpensesClick = function (month) {
        $window.location.href = "/CASiteExpenses/" + month;
    };
});

myApp.controller("caSitesDetailsController", function ($scope, $firebaseObject) {
    console.log("Inside caSitesDetailsController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    onPageLoad("CA-Sites");

    var finalCASitesList = [];

    var ownerDetailsRef = firebase.database().ref().child('OwnerDetails');
    var caSiteRef = firebase.database().ref().child('CASiteFundDetails');

    $scope.ownerDetails = $firebaseObject(ownerDetailsRef);
    var caSiteDetails = $firebaseObject(caSiteRef);

    $scope.ownerDetails.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
        $scope.ownerDetails.forEach(function (item) {
            if (caSiteDetails[item.ownerAccountNo]) {
                item.paidAmount = caSiteDetails[item.ownerAccountNo].paidAmount;
                item.pendingAmount = caSiteDetails[item.ownerAccountNo].pendingAmount
            }
            else {
                item.paidAmount = 0;
                item.pendingAmount = -1;
            }
        });
    });

    caSiteRef.on('value', function (snapshot) {
        caSiteDetails = snapshot.val();
        $scope.ownerDetails.forEach(function (item) {
            if (caSiteDetails[item.ownerAccountNo]) {
                item.paidAmount = caSiteDetails[item.ownerAccountNo].paidAmount;
                item.pendingAmount = caSiteDetails[item.ownerAccountNo].pendingAmount
            }
            else {
                item.paidAmount = 0;
                item.pendingAmount = -1;
            }
        });
    });

    //$('#notPaidCheckBox').on('change', function () {
    //    var newContent = [];
    //    if (this.checked) {
    //        finalCASitesList.forEach(function ($item) {
    //            if ($item.caFund.toLowerCase().includes("not paid")) {
    //                newContent.push($item);
    //            }
    //        });
    //        $scope.caSiteDetails = newContent;
    //    }
    //    else {
    //        $scope.corpusFundDetails = finalCASitesList;
    //    }
    //    $scope.$apply();
    //});
});

myApp.controller("caSitesExpensesController", function ($scope, $routeParams, $firebaseObject) {
    console.log("Inside caSitesExpensesController");

    $('#spinner').show();
    $('#bodyContainer').hide();
    onPageLoad("CA-Sites");

    $scope.totalExpenses = 0;
    var forMonth = $routeParams.month;
    var dbRef = firebase.database().ref().child('CASiteExpenses').child(forMonth);
    $scope.expenses = $firebaseObject(dbRef);
    $scope.expenses.$loaded().finally(function () {
        $('#spinner').hide();
        $('#bodyContainer').show();
    });
    var totalExpensesRef = firebase.database().ref('CASiteSummary').child(forMonth).child('TotalSpent');
    totalExpensesRef.on('value', function (snapshot) {
        $scope.totalExpenses = snapshot.val();
        $scope.$apply();
    });
});

myApp.controller("plotownersController", function ($scope, $firebaseObject) {
    console.log("Inside plotownersController");

    $('#spinner').hide();
    $('#bodyContainer').hide();
    onPageLoad("Owners");

    var email = sessionStorage.getItem("email");
    if (email) {
        if (email.localeCompare('krishna.pomar@gmail.com') == 0) {
            console.log('Admin');
            $('#memberForm').show();
        }
        else {
            $('#memberForm').hide();
        }
    }
    else {
        $('#memberForm').hide();
    }

    var dbRef = firebase.database().ref().child('OwnerDetails');
    $scope.ownersList = $firebaseObject(dbRef);
    $scope.ownersList.$loaded().finally(function () {
       $('#spinner').hide();
       $('#bodyContainer').show();
    });

    $scope.submit = function () {
        console.log($scope.ownerAccoutNo);
        if ($scope.ownerAccoutNo) {
            dbRef.child($scope.ownerAccoutNo).set({
                ownerAccountNo: $scope.ownerAccoutNo,
                ownerPlotNo: $scope.ownerPlotNo,
                ownerEmail: $scope.ownerEmail,
                ownerName: $scope.ownerName,
                ownerPhoneNumber: $scope.ownerPhoneNumber,
                resident: $scope.resident
            });
        }
    }
});

myApp.controller("summaryController", function ($scope, $firebaseObject) {
    console.log("Inside summaryController");
    $('#spinner').show();
    onPageLoad("Summary");
    var dbRef = firebase.database().ref().child('OwnerDetails');
    $scope.summary = $firebaseObject(dbRef);
    $scope.summary.$loaded().finally(function () {
        $('#spinner').hide();
    });
});

myApp.controller("loginController", function ($scope, $window) {
    console.log("Inside login controller");

    onPageLoad("login");
    $('#errorMessage').hide();

    var token = sessionStorage.getItem("googleToken");
    if (!token) {
        $('#signOut').css('display', 'none');
    }
    else {
        $('#signIn').css('display', 'none');
    }

    $scope.onSignIn = function () {
        if (!token) {
            googleSignIn($window);
        }
        else {
            $window.location.href = "/Summary";
        }
    };

    $scope.onSignOut = function () {
        if (token) {
            googleSignOut($window);
        }
    };
});

async function googleSignIn($window) {
    var provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Sign in successfull !!");
        sessionStorage.setItem("googleToken", result.credential.accessToken);
        sessionStorage.setItem("user", result.user.displayName);
        sessionStorage.setItem("profilePic", result.user.photoURL);
        sessionStorage.setItem("email", result.user.email);
        $window.history.go(-1);
    }).catch(function (error) {
        var errorMessage = error.message;
        $('#errorMessage').show();
        console.log(errorMessage);
    });
}

async function googleSignOut($window) {
    await firebase.auth().signOut().then(function () {
        $window.location.href = "/Summary";
        console.log("Signed out successfully !!");
        sessionStorage.removeItem("googleToken");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("profilePic");
        sessionStorage.removeItem("email");
        // Sign-out successful.
    }).catch(function (error) {
        console.log(error.message);
        // An error happened.
    });
}

function onPageLoad(page) {
    $(page).attr("border-bottom-style", 'solid');
    $(page).attr("border-bottom-color", '#1c6190');
    $(page).attr("color", '#1c6190');
    var profilePic = sessionStorage.getItem("profilePic")
    if (profilePic) {
        $("#userProfilePic").attr("src", profilePic);
    }
}

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
            templateUrl: 'pages/CorpusFundDetails.html',
            controller: 'corpusDetailsController'
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
            templateUrl: 'pages/CASitesDetail.html',
            controller: 'caSitesDetailsController'
        })

        .when('/Login', {
            templateUrl: 'pages/Login.html',
            controller: 'loginController'
        })

        .when('/Maintenance/:month', {
            templateUrl: 'pages/MaintenanceDetails.html',
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
    })
    .run(function ($rootScope, $firebaseObject) {
        $('#spinner').show();
        $('#bodyContainer').hide();
        var rootDBRef = firebase.database().ref();
        var rootDetails = $firebaseObject(rootDBRef);
        rootDetails.$loaded().finally(function () {
            $('#spinner').hide();
            $('#bodyContainer').show();
        });

        $rootScope.ownerDetailstRef = rootDBRef.child('OwnerDetails');
        $rootScope.ownerDetails = $firebaseObject($rootScope.ownerDetailstRef);

        $rootScope.maintenanceExpensesRef = rootDBRef.child('MaintenanceExpenses');
        $rootScope.maintenanceExpenses = $firebaseObject($rootScope.maintenanceExpensesRef);

        $rootScope.corpusExpensesRef = rootDBRef.child('CorpusFundExpenses');
        $rootScope.corpusExpenses = $firebaseObject($rootScope.corpusExpensesRef);

        $rootScope.caSitesExpensesRef = rootDBRef.child('CASiteExpenses');
        $rootScope.caSitesExpenses = $firebaseObject($rootScope.caSitesExpensesRef);

        $rootScope.maintenanceSummaryRef = rootDBRef.child('MaintenanceSummary');
        $rootScope.maintenanceSummary = $firebaseObject($rootScope.maintenanceSummaryRef);

        $rootScope.corpusSummaryRef = rootDBRef.child('CorpusFundSummary');
        $rootScope.corpusSummary = $firebaseObject($rootScope.corpusSummaryRef);

        $rootScope.caSitesSummaryRef = rootDBRef.child('CASiteSummary');
        $rootScope.caSitesSummary = $firebaseObject($rootScope.caSitesSummaryRef);

        $rootScope.summaryRef = rootDBRef.child('Summary');
        $rootScope.summary = $firebaseObject($rootScope.summaryRef);
    });

myApp.controller("adminController", function ($scope, $rootScope) {
    console.log("Inside adminController");
    onPageLoad("Admin");
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    $('#OwnerPaymentDetails').hide();
    $('#CorpusFundExpenses').hide();
    $('#CASiteExpenses').hide();
    $('#MaintenanceExpenses').hide();

    //var email = sessionStorage.getItem("email");
    //if (email) {
    //    if (email.localeCompare('krishna.pomar@gmail.com') == 0) {
    //        console.log('Admin');
    //        $('#adminForm').show();
    //        $('#errorMessage').hide();
    //    }
    //    else {
    //        $scope.unAuthorizedMessage = "You are not an Admin !!!"
    //        $('#adminForm').hide();
    //    }
    //}
    //else {
    //    $('#adminForm').hide();
    //    $scope.unAuthorizedMessage = "You are not an Admin !!!"
    //}

    $scope.showHideOwnerPaymentDetails = function () {
        if ($('#OwnerPaymentDetails').is(':visible')) {
            $('#OwnerPaymentDetails').hide();
        }
        else {
            $('#OwnerPaymentDetails').show();
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

    $scope.showHideCASiteExpensesDetails = function () {
        if ($('#CASiteExpenses').is(':visible')) {
            $('#CASiteExpenses').hide();
        }
        else {
            $('#CASiteExpenses').show();
        }
    }

    $scope.showHideMaintenanceExpensesDetails = function () {
        if ($('#MaintenanceExpenses').is(':visible')) {
            $('#MaintenanceExpenses').hide();
        }
        else {
            $('#MaintenanceExpenses').show();
        }
    }

    $scope.updateOwnerPaymentDetails = function (item) {
        if (item.corpusPaid != null) {
            $rootScope.ownerDetailstRef.child(item.ownerAccountNo).child('corpusFund').set({
                paid: item.corpusPaid,
                pending: item.corpusPending
            });

            if (parseInt(item.corpusPaid) > 0) {
                var totalReceived = 0, totalSpent = 0;
                if ($rootScope.corpusSummary['TotalReceived']) {
                    totalReceived = $rootScope.corpusSummary['TotalReceived'];
                }
                if ($rootScope.corpusSummary['TotalSpent']) {
                    totalSpent = $rootScope.corpusSummary['TotalSpent'];
                }
                totalReceived = parseInt(item.corpusPaid + totalReceived);
                $rootScope.corpusSummaryRef.set({
                    TotalReceived: totalReceived,
                    TotalSpent: totalSpent
                });
            }
            alert("Successfully updated : " + item.ownerAccountNo + " Corpus Fund details !");
        }
        if (item.caPaid != null) {
            $rootScope.ownerDetailstRef.child(item.ownerAccountNo).child('casites').set({
                paid: item.caPaid,
                pending: item.caPending
            });

            if (parseInt(item.caPaid) > 0) {
                var totalReceived = 0, totalSpent = 0;
                if ($rootScope.caSitesSummary['TotalReceived']) {
                    totalReceived = $rootScope.caSitesSummary['TotalReceived'];
                }
                if ($rootScope.caSitesSummary['TotalSpent']) {
                    totalSpent = $rootScope.caSitesSummary['TotalSpent'];
                }
                totalReceived = parseInt(item.caPaid + totalReceived);
                $rootScope.caSitesSummaryRef.set({
                    TotalReceived: totalReceived,
                    TotalSpent: totalSpent
                });
            }
            alert("Successfully updated : " + item.ownerAccountNo + " CA Fund details !");
        }
        if (item.forMonth != null) {
            $rootScope.ownerDetailstRef.child(item.ownerAccountNo).child('maintenance').child(item.forMonth).set({
                paid: item.maintPaid,
                pending: item.maintPending
            });

            //Updating Owner Maintenance Summary
            var ownerTotalMaintPaid = 0, ownerTotalMaintPending = 0;
            var ownerMaintDetailsRef = $rootScope.ownerDetailstRef.child(item.ownerAccountNo).child('maintenance');
            ownerMaintDetailsRef.on('value', function (snapshot) {
                var maintData = snapshot.val();
                for (let index in maintData) {
                    e = maintData[index];
                    ownerTotalMaintPaid = ownerTotalMaintPaid + e.paid;
                    ownerTotalMaintPending = ownerTotalMaintPending + e.pending;
                }
            });
            $rootScope.ownerDetailstRef.child(item.ownerAccountNo).child('maintenanceSummary').set({
                paid: ownerTotalMaintPaid,
                pending: ownerTotalMaintPending
            });

            ////Updating Maintenance Summary section
            //var totalReceived = 0, totalSpent = 0;
            //var maintSummaryRef = $rootScope.ownerDetailstRef;
            //maintSummaryRef.on('value', function (snapshot) {
            //    var maintSummaryData = snapshot.val();
            //    for (let index in maintSummaryData) {
            //        e = maintSummaryData[index];
            //        if (e.maintenance) {
            //            totalReceived = totalReceived + e.maintenance.paid;
            //        }
            //    }
            //});
            //if ($rootScope.maintenanceSummary[item.forMonth]) {
            //    totalSpent = $rootScope.maintenanceSummary[item.forMonth].TotalSpent;
            //}
            //$rootScope.maintenanceSummaryRef.child(item.forMonth).set({
            //    TotalReceived: totalReceived,
            //    TotalSpent: totalSpent,
            //    ForMonth: item.forMonth
            //});
            alert("Successfully updated : " + item.ownerAccountNo + " Maintenace details !");
        }
    };

    $scope.corpusFundExpense = function (item) {
        var expenseDate = item.corpusExpenseDate.getDate() + "/" + (item.corpusExpenseDate.getMonth() + 1) + "/" + item.corpusExpenseDate.getFullYear();
        if (item.corpusExpenseRemarks) {
            remarks = item.corpusExpenseRemarks;
        }
        else {
            remarks = '';
        }
        $rootScope.corpusExpensesRef.push({
            ExpenseAmount: item.corpusExpenseAmount,
            ExpenseType: item.corpusExpenseType,
            Remarks: remarks,
            Date: expenseDate
        });

        var totalSpentINR = 0, totalReceivedINR = 0;
        if ($rootScope.corpusSummary['TotalSpent']) {
            totalSpentINR = $rootScope.corpusSummary['TotalSpent'];
        }
        if ($rootScope.corpusSummary['TotalReceived']) {
            totalReceivedINR = $rootScope.corpusSummary['TotalReceived'];
        }
        totalSpentINR = parseInt(item.corpusExpenseAmount + totalSpentINR);
        $rootScope.corpusSummaryRef.set({
            TotalSpent: totalSpentINR,
            TotalReceived: totalReceivedINR
        });
        alert("Successfully updated : Corpus Fund Expense !");
    };

    $scope.caSiteExpense = function (item) {
        var expenseDate = item.caSiteExpenseDate.getDate() + "/" + (item.caSiteExpenseDate.getMonth() + 1) + "/" + item.caSiteExpenseDate.getFullYear();
        if (item.caSiteExpenseRemarks) {
            remarks = item.caSiteExpenseRemarks;
        }
        else {
            remarks = '';
        }
        $rootScope.caSitesExpensesRef.push({
            ExpenseAmount: item.caSiteExpenseAmount,
            ExpenseType: item.caSiteExpenseType,
            Remarks: remarks,
            Date: expenseDate
        });

        var totalSpentINR = 0, totalReceivedINR = 0;
        if ($rootScope.caSitesSummary['TotalSpent']) {
            totalSpentINR = $rootScope.caSitesSummary['TotalSpent'];
        }
        if ($rootScope.caSitesSummary['TotalReceived']) {
            totalReceivedINR = $rootScope.caSitesSummary['TotalReceived'];
        }
        totalSpentINR = parseInt(item.caSiteExpenseAmount + totalSpentINR);
        $rootScope.caSitesSummaryRef.set({
            TotalSpent: totalSpentINR,
            TotalReceived: totalReceivedINR
        });
        alert("Successfully updated : CA-Site Expense !");
    };

    $scope.maintExpense = function (item) {
        var maintMonth = months[item.maintExpenseDate.getMonth()] + item.maintExpenseDate.getFullYear();
        var expenseDate = item.maintExpenseDate.getDate() + "/" + (item.maintExpenseDate.getMonth() + 1) + "/" + item.maintExpenseDate.getFullYear();
        if (item.maintExpenseRemarks) {
            remarks = item.maintExpenseRemarks;
        }
        else {
            remarks = '';
        }
        $rootScope.maintenanceExpensesRef.child(maintMonth).push({
            ExpenseAmount: item.maintExpenseAmount,
            ExpenseType: item.maintExpenseType,
            Remarks: remarks,
            Date: expenseDate
        });

        var totalSpentINR = 0, totalReceivedINR = 0;
        if ($rootScope.maintenanceSummary[maintMonth]) {
            totalSpentINR = $rootScope.maintenanceSummary[maintMonth].TotalSpent;
            if ($rootScope.maintenanceSummary[maintMonth].TotalReceived) {
                totalReceivedINR = $rootScope.maintenanceSummary[maintMonth].TotalReceived;
            }
        }
        
        totalSpentINR = parseInt(item.maintExpenseAmount + totalSpentINR);
        $rootScope.maintenanceSummaryRef.child(maintMonth).set({
            TotalReceived: totalReceivedINR,
            TotalSpent: totalSpentINR,
            ForMonth: maintMonth
        });
        alert("Successfully updated : Maintenance Expense !");
    };
});

myApp.controller("maintenanceController", function ($scope, $window) {
    console.log("Inside maintenanceController");
    onPageLoad("Maintenance");

    $scope.maintSummaryClick = function (month) {
        $window.location.href = "/Maintenance/" + month;
    };

    $scope.maintExpensesClick = function (month) {
        $window.location.href = "/MaintenanceExpenses/" + month;
    };
});

myApp.controller("maintenanceExpensesController", function ($scope, $routeParams) {
    console.log("Inside maintenanceExpensesController");
    $scope.forMonth = $routeParams.month;
    onPageLoad("Maintenance");
});

myApp.controller("maintenanceDetailsController", function ($scope, $routeParams) {
    console.log("Inside maintenanceDetailsController");

    onPageLoad("Maintenance");

    $scope.forMonth = $routeParams.month;

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

    onPageLoad("Corpus Fund");

    $scope.receivedBtnClick = function () {
        $window.location.href = "/CorpusFundDetails";
    };
});

myApp.controller("corpusDetailsController", function ($scope) {
    console.log("Inside corpusDetailsController");

    onPageLoad("Corpus Fund");

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

myApp.controller("caSitesController", function ($scope, $window) {
    console.log("Inside caSitesController");

    onPageLoad("CA-Sites");

    $scope.receivedBtnClick = function () {
        $window.location.href = "/CASiteDetails";
    };
});

myApp.controller("caSitesDetailsController", function ($scope) {
    console.log("Inside casitesDetailsController");

    onPageLoad("CA-Sites");

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

myApp.controller("plotownersController", function ($scope, $rootScope) {
    console.log("Inside plotownersController");

    onPageLoad("Owners");
    
    //var email = sessionStorage.getItem("email");
    //if (email) {
    //    if (email.localeCompare('krishna.pomar@gmail.com') == 0) {
    //        console.log('Admin');
    //        $('#memberForm').show();
    //    }
    //    else {
    //        $('#memberForm').hide();
    //    }
    //}
    //else {
    //    $('#memberForm').hide();
    //}
    

    $scope.submit = function () {
        if ($scope.ownerAccoutNo) {
            $rootScope.ownerDetailstRef.child($scope.ownerAccoutNo).set({
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

myApp.controller("summaryController", function ($scope) {
    console.log("Inside summaryController");
    onPageLoad("Summary");

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
export default class MainCtrl {

  constructor($scope, userType) {
    'ngInject';

    let siteName = 'Visual Code';
    if (userType === 'admin') {
      siteName += ' (Admin)';
    }
    
    $scope.pageTitle = siteName;

    $scope.$on('$stateChangeSuccess', function (event, toState) {
      if (toState.data != null && toState.data.pageTitle != null) {
        $scope.pageTitle = toState.data.pageTitle + ' | ' + siteName;
      } else {
        $scope.pageTitle = siteName;
      }
    });
  }
}
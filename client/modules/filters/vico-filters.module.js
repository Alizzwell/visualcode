import angular from 'angular';

export default angular
  .module('VicoFilters', [])
  
  .filter('vicoDate', function ($filter) {
    return function (date) {
      var diff = new Date().getTime() - new Date(date).getTime();
      diff /= (60 * 1000);

      if (diff < 1) {
        return '1분 미만';
      }

      if (diff < 60) {
        return parseInt(diff) + '분 전';
      }

      diff /= 60;

      if (diff < 24) {
        return parseInt(diff) + '시간 전';
      }

      diff /= 24;
      if (diff < 2) {
        return '어제';
      }

      if (diff < 31) {
        if ($filter('date')(date, 'M') == $filter('date')(new Date(), 'M')) {
          return parseInt(diff) + '일 전';
        }
      }
      
      return $filter('date')(date, 'y년 M월 d일');
    };
  });
  
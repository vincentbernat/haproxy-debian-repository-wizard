angular.module('haproxy', [])
  .controller('InstructionsCtrl', function($scope, $location) {
    'use strict';

    $scope.distributions = {
      Debian: {
        wheezy: 'Wheezy (7)',
        jessie: 'Jessie (8)',
        sid: 'Sid (unstable)'
      },
      Ubuntu: {
        precise: 'Precise (12.04 LTS)',
        trusty: 'Trusty (14.04 LTS)',
        xenial: 'Xenial (16.04)',
        yakkety: 'Yakkety (16.10)'
      }
    };
    $scope.versions = {
      '1.4': '1.4-stable',
      '1.5': '1.5-stable',
      '1.6': '1.6-stable',
      '1.7': '1.7-dev'
    };
    // + means latest version, - means a stable version
    var matrix = {
      wheezy:  { '1.4': 'hdn+',           '1.5': 'backports-|hdn+', '1.6': 'backports-sloppy+|hdn+' },
      jessie:  { '1.4': 'hdn+',           '1.5': 'official-|hdn+',  '1.6': 'backports+|hdn+' },
      sid:     {                                                    '1.6': 'official+',            '1.7': 'experimental+' },
      precise: { '1.4': 'official-|ppa+', '1.5': 'ppa+',            '1.6': 'ppa+' },
      trusty:  { '1.4': 'official-',      '1.5': 'backports-|ppa+', '1.6': 'ppa+',                 '1.7': 'ppa+' },
      xenial:  {                          '1.5': 'ppa+',            '1.6': 'official-|ppa+',       '1.7': 'ppa+' },
      yakkety: {                                                    '1.6': 'official+',            '1.7': 'ppa+' }
    };

    // Helper function to select the appropriate mirror and distribution
    $scope.debian = function(release, subrelease) {
      var suffix = 'debian';
      var distribution = subrelease?[release, subrelease].join('-'):release;
      return 'http://httpredir.debian.org/' + suffix + ' ' + distribution;
    };

    $scope.selected = $location.search() || {};
    $scope.$on('$locationChangeSuccess', function(event){
      $scope.selected = $location.search() || {};
    });

    $scope.solutions = (function() {
      var previous = null;

      return function() {
        if (!$scope.selected.distribution ||
            !$scope.selected.release ||
            !$scope.selected.version) {
          return null;
        }
        $location.search('distribution', $scope.selected.distribution);
        $location.search('release', $scope.selected.release);
        $location.search('version', $scope.selected.version);

        var proposed = (matrix[$scope.selected.release] || {})[$scope.selected.version]
          , solutions = (proposed || 'unavailable').split('|')
          , current = solutions.map(function(solution) {
            return {version: { '+': 'latest', '-': 'stable'}[solution.slice(-1)] || null,
                    distribution: solution.replace(/\+|\-$/, ''),
                    id: solution};
          });
        if (JSON.stringify(previous) === JSON.stringify(current)) {
          return previous;
        }
        previous = current;
        return current;
      };
    })();
  });

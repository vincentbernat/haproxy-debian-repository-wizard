angular.module('haproxy', [])
  .controller('InstructionsCtrl', function($scope) {
    'use strict';

    $scope.distributions = {
      Debian: {
        squeeze: 'Squeeze (6)',
        wheezy: 'Wheezy (7)',
        jessie: 'Jessie (8)',
        sid: 'Sid (unstable)'
      },
      Ubuntu: {
        precise: 'Precise (12.04 LTS)',
        trusty: 'Trusty (14.04 LTS)',
        vivid: 'Vivid (15.04)'
      }
    };
    $scope.versions = [
      '1.4-stable',
      '1.5-stable',
      '1.6-dev'
    ];
    // + means latest version, - means a stable version
    var matrix = {
      squeeze: { '1.4-stable': 'hdn+',           '1.5-stable': 'backports-sloppy-|hdn+' },
      wheezy:  { '1.4-stable': 'hdn+',           '1.5-stable': 'backports-|backports-sloppy+' },
      jessie:  { '1.4-stable': 'hdn+',           '1.5-stable': 'official-|backports+' },
      sid:     {                                 '1.5-stable': 'official+', '1.6-dev': 'experimental+' },
      precise: { '1.4-stable': 'official-|ppa+', '1.5-stable': 'ppa+' },
      trusty:  { '1.4-stable': 'official-|ppa+', '1.5-stable': 'backports-|ppa+' },
      vivid:   {                                 '1.5-stable': 'official-|ppa+' }
    };

    $scope.selected = {};

    $scope.solutions = (function() {
      var previous = null;

      return function() {
        if (!$scope.selected.distribution ||
            !$scope.selected.release ||
            !$scope.selected.version) {
          return null;
        }

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

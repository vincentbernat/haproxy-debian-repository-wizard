angular.module('haproxy', [])
  .controller('InstructionsCtrl', function($scope) {
    'use strict';

    $scope.distributions = {
      Debian: {
        squeeze: 'Squeeze (6)',
        wheezy: 'Wheezy (7)',
        jessie: 'Jessie (8)'
      },
      Ubuntu: {
        precise: 'Precise (12.04 LTS)',
        trusty: 'Trusty (14.04 LTS)'
      }
    };
    $scope.versions = [
      '1.4',
      '1.5'
    ];
    // + means latest version, - means a stable version
    var matrix = {
      squeeze: { '1.4': 'backports-sloppy-' },
      wheezy: { '1.5': 'backports-' },
      jessie: { '1.5': 'official-' },
      precise: { '1.4': 'ppa+', '1.5': 'ppa+' },
      trusty: { '1.4': 'ppa+', '1.5': 'backports-|ppa+' }
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
                    distribution: solution.slice(0, -1),
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

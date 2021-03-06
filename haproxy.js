angular.module('haproxy', [])
  .controller('InstructionsCtrl', function($scope, $location) {
    'use strict';

    $scope.distributions = {
      Debian: {
        stretch:  'Stretch (9)',
        buster:   'Buster (10)',
        bullseye: 'Bullseye (11)',
        sid:      'Sid (unstable)'
      },
      Ubuntu: {
        trusty:  'Trusty (14.04 LTS)',
        xenial:  'Xenial (16.04 LTS)',
        bionic:  'Bionic (18.04 LTS)',
        focal:   'Focal (20.04 LTS)',
        groovy:  'Groovy (20.10)',
        hirsute: 'Hirsute (21.04)'
      }
    };
    $scope.versions = {
      '1.6': '1.6-stable',
      '1.7': '1.7-stable',
      '1.8': '1.8-stable (LTS)',
      '2.0': '2.0-stable (LTS)',
      '2.1': '2.1-stable',
      '2.2': '2.2-stable (LTS)',
      '2.3': '2.3-stable',
      '2.4': '2.4-stable (LTS)'
    };
    // + means latest version, - means a stable version
    var matrix = {
      // Debian
      stretch:  { '1.6': 'hdn+',            '1.7': 'official-|hdn+',  '1.8': 'hdn+',
                  '2.0': 'hdn+',            '2.1': 'hdn+',            '2.2': 'hdn+' },
      buster:   {                                                     '1.8': 'official-|hdn+',
                  '2.0': 'hdn+',            '2.1': 'hdn+',            '2.2': 'backports-|hdn+',
                  '2.3': 'hdn+',            '2.4': 'hdn+' },
      bullseye: { '2.2': 'official-',       '2.4': 'hdn+' },
      sid:      {                                                     '2.2': 'official+',
                                            '2.4': 'experimental' },
      // Ubuntu
      trusty:   { '1.6': 'ppa+',            '1.7': 'ppa+',            '1.8': 'ppa+' },
      xenial:   { '1.6': 'official-|ppa+',  '1.7': 'ppa+',            '1.8': 'ppa+',
                  '2.0': 'ppa+' },
      bionic:   { '1.7': 'ppa+',                                      '1.8': 'official-|ppa+',
                  '2.0': 'ppa+',            '2.1': 'ppa+',            '2.2': 'ppa+',
                  '2.3': 'ppa+',            '2.4': 'ppa+' },
      focal:    { '2.0': 'official-|ppa+',  '2.1': 'ppa+',            '2.2': 'ppa+',
                  '2.3': 'ppa+',            '2.4': 'ppa+' },
      groovy:   {                                                     '2.2': 'official-' },
      hirsute:  {                                                     '2.2': 'official-' }
    };

    // Helper function to select the appropriate mirror and distribution
    $scope.debian = function(release, subrelease) {
      var suffix = 'debian';
      var distribution = subrelease?[release, subrelease].join('-'):release;
      return 'http://deb.debian.org/' + suffix + ' ' + distribution;
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

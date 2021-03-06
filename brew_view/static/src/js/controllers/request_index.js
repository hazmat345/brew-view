import {formatDate} from '../services/utility_service.js';

requestIndexController.$inject = [
  '$scope',
  'DTOptionsBuilder',
  'DTColumnBuilder',
  'RequestService',
];

/**
 * requestIndexController - Angular controller for viewing all requests.
 * @param  {Object} $scope            Angular's $scope object.
 * @param  {Object} DTOptionsBuilder  Data-tables' options builder object.
 * @param  {Object} DTColumnBuilder   Data-tables' column builder object.
 * @param  {Object} RequestService    Beer-Garden Request Service.
 */
export default function requestIndexController(
    $scope,
    DTOptionsBuilder,
    DTColumnBuilder,
    RequestService) {
  $scope.setWindowTitle('requests');

  $scope.requests = {};

  $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withOption('autoWidth', false)
    .withOption('ajax', function(data, callback, settings) {
      // Need to also request ID for the href
      data.columns.push({'data': 'id'});

      RequestService.getRequests(data).then(
        (response) => {
          $scope.response = response;

          callback({
            data: response.data,
            draw: response.headers('draw'),
            recordsFiltered: response.headers('recordsFiltered'),
            recordsTotal: response.headers('recordsTotal'),
          });
        },
        (response) => {
          $scope.response = response;
        }
      );
    })
    .withLightColumnFilter({
      0: {html: 'input', type: 'text', attr: {class: 'form-inline form-control'}},
      1: {html: 'input', type: 'text', attr: {class: 'form-inline form-control'}},
      2: {html: 'input', type: 'text', attr: {class: 'form-inline form-control'}},
      3: {
        html: 'select',
        type: 'text',
        cssClass: 'form-inline form-control',
        values: [
          {value: '', label: ''},
          {value: 'CREATED', label: 'CREATED'},
          {value: 'RECEIVED', label: 'RECEIVED'},
          {value: 'IN_PROGRESS', label: 'IN PROGRESS'},
          {value: 'CANCELED', label: 'CANCELED'},
          {value: 'SUCCESS', label: 'SUCCESS'},
          {value: 'ERROR', label: 'ERROR'},
        ],
      },
      4: {
        html: 'range',
        type: 'text',
        attr: {
          class: 'form-inline form-control w-50',
        },
        startAttr: {
          placeholder: 'start',
        },
        endAttr: {
          placeholder: 'end',
        },
        picker: {
          format: 'YYYY-MM-DD HH:mm:ss',
          showClear: true,
          showTodayButton: true,
          useCurrent: false,
        },
      },
      5: {html: 'input', type: 'text', attr: {class: 'form-inline form-control'}},
    })
    .withDataProp('data')
    .withOption('order', [4, 'desc'])
    .withOption('serverSide', true)
    .withPaginationType('full_numbers')
    .withBootstrap();

  $scope.dtColumns = [
    DTColumnBuilder
      .newColumn('command')
      .withTitle('Command Name')
      .renderWith(function(data, type, full) {
        return '<a href="#!/requests/' + full.id + '">' + data + '</a>';
      }),
    DTColumnBuilder
      .newColumn('system')
      .withTitle('System')
      .renderWith(function(data, type, full) {
        let systemName = data;
        if (full['metadata'] && full['metadata']['system_display_name']) {
          systemName = full['metadata']['system_display_name'];
        }
        return systemName;
      }),
    DTColumnBuilder
      .newColumn('instance_name')
      .withTitle('Instance'),
    DTColumnBuilder
      .newColumn('status')
      .withTitle('Status'),
    DTColumnBuilder
      .newColumn('created_at')
      .withTitle('Created')
      .withOption('type', 'date')
      .withOption('width', '25%')
      .renderWith(function(data, type, full) {
        return formatDate(data);
      }),
    DTColumnBuilder
      .newColumn('comment')
      .withTitle('Comment'),
    DTColumnBuilder
      .newColumn('metadata')
      .notVisible(),
  ];

  $scope.instanceCreated = function(_instance) {
    $scope.dtInstance = _instance;
  };

  $scope.$on('userChange', function() {
    $scope.response = undefined;

    if ($scope.dtInstance) {
      $scope.dtInstance.reloadData(() => {}, false);
    }
  });
};

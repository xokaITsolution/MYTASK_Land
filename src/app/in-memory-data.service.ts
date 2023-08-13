import {InMemoryDbService} from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const PlotManagementList = [
      {PlotID: '01', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '02', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'}
    ];
    const PropertyList = [
      {PlotID: '1', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '2', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '3', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '4', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '5', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '6', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '7', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '8', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '9', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '10', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'},
      {PlotID: '11', Status: 'stauts', Area: '12M2', RegisterationDate: '12/5/2018', ParentPlotID: '12'}
    ];
    const CertificateVersionList = [
      {TitleDeedNo: '1', PropertyID: '548', TransferredFrom: 'Alpha', TransferredTo: 'Beta', ParentDeedID: '123', TransfetType: 'Gift'},
      {TitleDeedNo: '2', PropertyID: 'stauts', TransferredFrom: 'Beta', TransferredTo: 'Alpha', ParentDeedID: '124', TransfetType: 'Sale'}
    ];

    const MytasksList = [{
      Application: 'app01',
      Date: '14/5/2018',
      TaskDescription: 'Task DEsc',
      TaskStatus: 'Task stst',
      Type: 'Type'
    }, {
      Application: 'app1',
      Date: '16/5/2018',
      TaskDescription: 'Task DEsc1',
      TaskStatus: 'Task stst1',
      Type: 'Type1'
    }
    ];
    const SupervisertasksList = [{
      Application: 'app',
      Date: '14/5/2018',
      TaskDescription: 'Task DEsc',
      TaskStatus: 'Task stst',
      Type: 'Type'
    }, {
      Application: 'app1',
      Date: '16/5/2018',
      TaskDescription: 'Task DEsc1',
      TaskStatus: 'Task stst1',
      Type: 'Type1'
    }
    ];
    const treeList =
      [
        {
          'label': 'Building',
          'children': [{
            'label': 'Floor',
            'children': [
              {'label': 'Room1'},
              {'label': 'Room2'}
            ]
          },
            {
              'label': 'Floor2'
            },
            {
              'label': 'Floor3'
            }]
        }
      ];
    return {PlotManagementList, PropertyList, CertificateVersionList, SupervisertasksList, MytasksList, treeList};
  }
}

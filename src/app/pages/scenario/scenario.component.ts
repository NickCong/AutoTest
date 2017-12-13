import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StepComponent } from '../step/step.component'
import { StepModule } from '../../common/models/step.module'
import { HttpModule } from '@angular/http';
import { ScenarioModule } from '../../common/models/scenario.module';
import { CaseModule } from '../../common/models/case.module';
import { ProjectModule } from '../../common/models/project.module';
import { AllProject } from '../../common/models/allproject.module';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AWS_CONFIGURATION } from '../../../environments/environment';
import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery'

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})

export class ScenarioComponent implements OnInit {
  exist = false;
  currentProjectName: string;
  currentScenarioId: string;
  projects: ProjectModule[];
  AWSproject: any;
  AWSScenario: any;
  project: ProjectModule;
  scenario: ScenarioModule;
  onecase: CaseModule;
  newsteporder: number;
  operations = [
    { label: 'Select', value: null },
    { label: 'Click', value: { id: 1, name: 'Click' } },
    { label: 'Input', value: { id: 2, name: 'Input' } },
    { label: 'Dropdown', value: { id: 3, name: 'Dropdown' } },
    { label: 'Assertion', value: { id: 4, name: 'Assertion' } }
  ];
  selectors = [
    { label: 'Select', value: null },
    { label: 'ID', value: { id: 1, name: 'ID' } },
    { label: 'Name', value: { id: 2, name: 'Name' } },
    { label: 'Class', value: { id: 3, name: 'Class' } },
    { label: 'Text', value: { id: 3, name: 'Text' } },
    { label: 'Partial Link Text', value: { id: 3, name: 'Partial Link Text' } },
    { label: 'Tag Name', value: { id: 3, name: 'Tag Name' } },
    { label: 'XPath', value: { id: 3, name: 'XPath' } },
    { label: 'CSS Selector', value: { id: 3, name: 'CSS Selector' } }
  ];
  constructor(private router: Router, private route: ActivatedRoute, private autotest: RunAutoTestService, private confirmationService: ConfirmationService) {
    this.currentProjectName = this.route.params["value"].projectName;
    this.currentScenarioId = this.route.params["value"].scenarioid;
    this.exist = this.route.params["value"].source == 'exist';
    this.project = new ProjectModule;
    let self = this;
    this.scenario = {
      scenario_id: this.currentScenarioId,
      scenario_order: '',
      scenario_name: '',
      scenario_description: '',
      scenario_url: [{ order: 1, action: 'Click', wait: '', enterValue: '', type: 'ID', typePath: '', steps_result: '', textTag: '' }],
      cases: [],
    };

    if (this.exist) {
      // get scenario by id from DB

      this.autotest.GetScenarioById(this.currentScenarioId, (error, result) => {
        self.scenario = new ScenarioModule;
        self.scenario.scenario_id = result.Item.ID;
        self.scenario.scenario_description = result.Item.Description;
        self.scenario.scenario_name = result.Item.SName;
        self.scenario.scenario_order = result.Item.Order;
        self.scenario.scenario_url = result.Item.Url;
        self.scenario.cases=[];
        self.AWSScenario = result.Item;
        for(let j=0;j<result.Item.Cases.length;j++)
        {
          self.autotest.GetCaseById(result.Item.Cases[j], (err: any, data: any)=>{
              if(err){
                console.log(err)
              }
              else{
                let temponecase = new CaseModule;
                temponecase.case_id = data.Item.ID;
                temponecase.case_name = data.Item.CName;
                temponecase.case_description = data.Item.Description;
                temponecase.case_expect_result = data.Item.Expect_result;
                temponecase.case_actual_result = data.Item.Actual_result;
                temponecase.case_order = data.Item.Order;
                temponecase.steps=data.Item.steps;
                self.scenario.cases.push(temponecase)

              }
          })
        }
      });

    }
  }

  ngOnInit() {

  }

  addnew(): void {
    this.scenario.scenario_url.push({ order: this.scenario.scenario_url.length + 1, action: 'Click', wait: '', enterValue: '', type: 'ID', typePath: '', steps_result: '', textTag: '' })
  }

  removeCurrent(): void {
    if (this.scenario.scenario_url.length > 1) {
      this.scenario.scenario_url.pop();
    }
  }
  getNewCase(newCase): void {
    // this.autotest.GetCaseById(this.currentScenarioId, (error, result) => {
    //   this.onecase = new CaseModule;
    //   this.onecase.case_id = result.Item.ID;
    //   this.onecase.case_name = result.Item.Name;
    //   this.onecase.case_description = result.Item.case_description;
    //   this.onecase.case_expect_result = result.Item.case_expect_result;
    //   this.onecase.case_actual_result = result.Item.case_actual_result;
    //   this.onecase.steps=result.Item.steps;
    // });

  }

  editCase(i: number): void {
    this.router.navigate(['/Case', { projectName: this.currentProjectName,scenarioid:this.scenario.scenario_id, caseid: i , source:"exist" ,order:0}]);
  }
  runCase(id: string): void {
      let self = this;
      let paras={
        projectName:this.currentProjectName,
        scenarioID:this.currentScenarioId,
        caseID:id
      }
      this.autotest.RunPhantomjs(paras).then(result => {
        if (result) {
          self.confirmationService.confirm({
            message: 'Are you sure that you want to update the case test result?',
            accept: () => {
              self.RefreshProject();
            }
          });
        }
      });
  }
  RefreshProject(): void {
    this.autotest.GetTestResult().then(response => {
      let project = JSON.parse(response);
      this.scenario.cases[0] = project[0].scenarios[0].cases[0];
    });
  }
  exportTestCase(): void {
    // var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    // let ressult = [{

    // }];
    // var content = JSON.stringify(ressult);
    // var blob = new Blob([content]);
    // //aLink.download = "TestCase.json";
    // //aLink.href = URL.createObjectURL(blob);
    // aLink.setAttribute('href', URL.createObjectURL(blob));
    // aLink.setAttribute('download', "TestCase.json");
    // aLink.click();
    // window.URL.revokeObjectURL(aLink.href);
  }
  saveScenario(): void {
    let params = {
      TableName: AWS_CONFIGURATION.SCENARIOTABLENAME,
      Item: {
        ID: this.scenario.scenario_id,
        Description: this.scenario.scenario_description,
        SName: this.scenario.scenario_name,
        Order: String(this.project.scenarioIDs.length + 1),
        Url: "url",//this.scenario.scenario_url
        Cases: []
      }
    };
    if (this.exist) {
      params.Item.Order = this.scenario.scenario_order;
      params.Item.Cases = this.AWSScenario.Cases;
    }
    else{
      // this.project.scenarioIDs.push(this.scenario.scenario_id)
      let projectparams = {
        TableName : AWS_CONFIGURATION.PROJECTTABLENAME,
        Key: { ProjectName : this.currentProjectName},
        AttributeUpdates: {
          'ScenarioIDs': {
            Action: 'ADD',
            Value: [this.scenario.scenario_id]
          },
        }
      };
      this.autotest.UpdateProject(projectparams);
      this.autotest.CreateScenario(params);
    }
    this.router.navigate(['/project', { name: this.currentProjectName, IsView: false }]);
  }
  createSep() {
    this.router.navigate(['/Case', { projectName: this.currentProjectName,scenarioid:this.scenario.scenario_id, caseid: this.autotest.GenerateUUID() , source:"new", order:this.scenario.cases.length+1 }]);
  }
}

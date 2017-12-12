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
  //projects: ProjectModule[];
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
    this.autotest.GetProjectByName(this.currentProjectName, (error, result) => {
      self.project = new ProjectModule;
      self.project.base_url = result.Item.BaseUrl;
      self.project.project_name = result.Item.ProjectName;
      self.project.project_description = result.Item.Description;
      self.project.user = result.Item.User;
      self.project.password = result.Item.Password;
      self.project.scenarioIDs = result.Item.ScenarioIDs;
      self.project.scenario_count = result.Item.ScenarioIDs.length;
      self.AWSproject = result.Item;
    });
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
        self.AWSScenario = result.Item;
      });
    }
    this.onecase = {
      case_name: '',
      case_id: this.scenario.scenario_id + '-' + (this.scenario.cases.length + 1),
      case_description: '',
      case_expect_result: '',
      case_actual_result: '', steps: [{ order: this.scenario.cases.length + 1, action: 'Click', wait: '', enterValue: '', type: 'ID', typePath: '', steps_result: '', textTag: '' }]
    };
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
    newCase.case_id = this.scenario.scenario_id + '-' + (this.scenario.cases.length + 1);
    this.scenario.cases.push(newCase);
    this.onecase = {
      case_name: '',
      case_id: this.scenario.scenario_id + '-' + (this.scenario.cases.length + 1),
      case_description: '',
      case_expect_result: '',
      case_actual_result: '', steps: [{ order: this.scenario.cases.length + 1, action: 'Click', wait: '', enterValue: '', type: 'ID', typePath: '', steps_result: '', textTag: '' }]
    };
  }

  editCase(i: number): void {
    this.router.navigate(['/Case', { projectid: this.project.project_air_id, scenarioid: this.scenario.scenario_id, caseid: i }]);
  }
  runCase(i: number): void {
    let runproject = {
      base_url: this.project.base_url,
      user: this.project.user,
      password: this.project.password,
      project_name: this.project.project_name,
      project_air_id: this.project.project_air_id,
      project_description: this.project.project_description,
      scenario_count: this.project.scenarioIDs.length.toString(),
      scenarioIDs: this.project.scenarioIDs,
      scenarios: []
    };
    let runscenario = {
      scenario_id: this.scenario.scenario_id,
      scenario_name: this.scenario.scenario_name,
      scenario_description: this.scenario.scenario_description,
      scenario_url: [],
      cases: [],
    };
    let runcase = this.scenario.cases[i];
    let self = this;
    runscenario.cases = [runcase];
    runproject.scenarios = [runscenario];
    let needdownload = false;
    for (let j = 0; j < runcase.steps.length; j++) {
      if (runcase.steps[j].action == 'Download') {
        needdownload = true;
        break;
      }
    }
    if (needdownload) {
      this.autotest.Run([runproject]).then(result => {
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
    else {
      this.autotest.RunPhantomjs([runproject]).then(result => {
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
  }
  RefreshProject(): void {
    this.autotest.GetTestResult().then(response => {
      let project = JSON.parse(response);
      this.scenario.cases[0] = project[0].scenarios[0].cases[0];
    });
  }
  exportTestCase(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let ressult = [{
      "base_url": this.project.base_url,
      "user": this.project.user,
      "password": this.project.password,
      "project_name": this.project.project_name,
      "project_air_id": this.project.project_air_id,
      "project_description": this.project.project_description,
      "scenarios": [{
        "scenario_id": this.scenario.scenario_id,
        "scenario_name": this.scenario.scenario_name,
        "scenario_description": this.scenario.scenario_description,
        "scenario_url": this.scenario.scenario_url,
        "cases": this.scenario.cases
      }]
    }];
    var content = JSON.stringify(ressult);
    var blob = new Blob([content]);
    //aLink.download = "TestCase.json";
    //aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
  saveScenario(): void {
    let params = {
      TableName: AWS_CONFIGURATION.SCENARIOTABLENAME,
      Item: {
        ID: this.scenario.scenario_id,
        Description: this.scenario.scenario_description,
        SName: this.scenario.scenario_name,
        Order: String(this.project.scenarioIDs.length + 1),
        Url: this.project.base_url,//this.scenario.scenario_url
        Cases: []
      }
    };
    if (this.exist) {
      params.Item.Order = this.scenario.scenario_order;
      params.Item.Cases = this.AWSScenario.Cases;
    }
    else{
      this.project.scenarioIDs.push(this.scenario.scenario_id)
      let projectparams = {
        TableName : AWS_CONFIGURATION.PROJECTTABLENAME,
        Key: { ProjectName : this.project.project_name },
        AttributeUpdates: {
          'ScenarioIDs': {
            Action: 'PUT',
            Value: this.project.scenarioIDs
          },
        }
      };
      this.autotest.UpdateProject(projectparams);
    }
    this.autotest.CreateScenario(params);
    this.router.navigate(['/project', { name: this.project.project_name, IsView: false }]);
  }
  createSep() {
    this.router.navigate(['/Case', { projectid: this.project.project_air_id, scenarioid: this.scenario.scenario_id, caseid: this.scenario.cases.length + 1 }]);
  }
}

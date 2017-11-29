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
import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery'

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})

export class ScenarioComponent implements OnInit {
  rootUrl: string;
  currentProjectId: number;
  currentScenarioId: number;
  projects: ProjectModule[];
  project: ProjectModule;
  scenario: ScenarioModule;
  onecase: CaseModule;
  newsteporder: number;
  operations =[
    {label:'Select', value:null},
    {label:'Click', value:{id:1, name: 'Click'}},
    {label:'Input', value:{id:2, name: 'Input'}},
    {label:'Dropdown', value:{id:3, name: 'Dropdown'}},
    {label:'Assertion', value:{id:4, name: 'Assertion'}}
];
  selectors = [
    {label:'Select', value:null},
    {label:'ID', value:{id:1, name: 'ID'}},
    {label:'Name', value:{id:2, name: 'Name'}},
    {label:'Class', value:{id:3, name: 'Class'}},
    {label:'Text', value:{id:3, name: 'Text'}},
    {label:'Partial Link Text', value:{id:3, name: 'Partial Link Text'}},
    {label:'Tag Name', value:{id:3, name: 'Tag Name'}},
    {label:'XPath', value:{id:3, name: 'XPath'}},
    {label:'CSS Selector', value:{id:3, name: 'CSS Selector'}}
];
  constructor(private router: Router, private route: ActivatedRoute, global: AllProject, private autotest: RunAutoTestService) {
    this.projects = global.Projects;
    this.currentProjectId = parseInt(this.route.params["value"].projectid);
    this.currentScenarioId = parseInt(this.route.params["value"].scenarioid);
    this.project = this.projects[this.currentProjectId - 1];
    if (this.currentScenarioId > this.project.scenarios.length) {
      this.scenario = {
        scenario_id: this.currentScenarioId,
        scenario_name: '',
        scenario_description: '',
        scenario_url: [{ order: 1, action: 'Click', wait:'',enterValue: '', type: 'ID', typePath: '', steps_result:'',textTag:'' }],
        cases: [],
      };
    } else {
      this.scenario = this.project.scenarios[this.currentScenarioId - 1];
    }
    this.onecase = {
      case_name: '',
      case_id: this.scenario.scenario_id + '-' + (this.scenario.cases.length + 1),
      case_description: '',
      case_expect_result: '',
      case_actual_result: '', steps: [{ order: this.scenario.cases.length + 1, action: 'Click', wait:'',enterValue: '', type: 'ID', typePath: '', steps_result:'',textTag:'' }]
    };
  }

  ngOnInit() {

  }

  addnew(): void {
    this.scenario.scenario_url.push({ order: this.scenario.scenario_url.length + 1, action: 'Click', wait:'',enterValue: '', type: 'ID', typePath: '', steps_result:'',textTag:'' })
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
      case_actual_result: '', steps: [{ order: this.scenario.cases.length + 1, action: 'Click', wait:'',enterValue: '', type: 'ID', typePath: '', steps_result:'' ,textTag:''}]
    };
  }

  editCase(i: number): void {
    this.router.navigate(['/Case',{projectid:this.project.project_air_id, scenarioid: this.scenario.scenario_id,caseid:i}]);
  }
  runCase(i: number): void {
    let runproject = this.project;
    let runscenario = this.scenario;
    let runcase = this.scenario.cases[i];
    runscenario.cases= [runcase];
    runproject.scenarios = [runscenario];
    this.autotest.Run([runproject]).then(result => {
      if (result) {
        alert('AutoTest Finished!');
      }
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
    if (this.scenario.scenario_id > this.project.scenarios.length) {
      this.project.scenarios.push(this.scenario);
    }
    else{
      this.project.scenarios[this.scenario.scenario_id-1]= this.scenario;
    }
    this.router.navigate(['/project', this.project.project_air_id]);
  }
  createSep(){
    this.router.navigate(['/Case',{projectid:this.project.project_air_id, scenarioid: this.scenario.scenario_id,caseid: this.scenario.cases.length+1 }]);
  }
}

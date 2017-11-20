import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StepComponent } from '../step/step.component'
import { StepModule } from '../../common/models/step.module'
import { HttpModule } from '@angular/http';
import { ScenarioModule } from '../../common/models/scenario.module';
import { CaseModule } from '../../common/models/case.module';
import { ProjectModule } from '../../common/models/project.module';
import { AllProject } from '../../common/models/allproject.module';
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
  constructor(private route: ActivatedRoute, global: AllProject) {
    this.projects = global.Projects;
    this.currentProjectId = parseInt(this.route.params["value"].projectid);
    this.currentScenarioId = parseInt(this.route.params["value"].scenarioid);
    console.log(this.projects)
    this.project = this.projects[this.currentProjectId - 1];
    if (this.currentScenarioId > this.project.scenarios.length) {
      this.scenario = {
        scenario_id: this.currentScenarioId,
        scenario_name: '',
        scenario_description: '',
        scenario_url: [],
        cases: [],
      };
    } else {
      this.scenario = this.project.scenarios[this.currentScenarioId - 1];
    }
    this.onecase = {
      case_name: '',
      case_id: '',
      case_description: '',
      case_expect_result: '',
      case_actual_result: '', steps: [{ order: this.scenario.cases.length + 1, action: 'Click', enterValue: '', type: 'ID', typePath: '' }]
    };
  }

  ngOnInit() {

  }

  getNewCase(newCase): void {
    this.scenario.cases.push(newCase);
    this.onecase = {
      case_name: '',
      case_id: '',
      case_description: '',
      case_expect_result: '',
      case_actual_result: '', steps: [{ order: this.scenario.cases.length + 1, action: 'Click', enterValue: '', type: 'ID', typePath: '' }]
    };
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
        "cases": []
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
    this.project.scenarios.push(this.scenario);
  }
}
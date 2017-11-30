import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as $ from 'jquery'
import { StepModule } from '../../common/models/step.module'
import { Operations } from '../../common/models/step.operation.module'
import { Selectors } from '../../common/models/step.selector.module'
import { CaseModule } from '../../common/models/case.module'
import { Dropdown_M } from '../../common/models/step.module'
import { SelectedItem } from '../../common/models/step.selector.module'
import { SelectedItem2 } from '../../common/models/step.selector.module'
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AllProject } from '../../common/models/allproject.module';
import { ProjectModule } from '../../common/models/project.module';
import { ScenarioModule } from '../../common/models/scenario.module';
import { Location } from '@angular/common';
import { Dropdown } from 'primeng/primeng';
@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {
  Stepdisplay: boolean = false;
  currentProjectId: number;
  currentScenarioId: number;
  CaseId: number;
  projects: ProjectModule[];
  onecase: CaseModule;
  project: ProjectModule;
  scenario: ScenarioModule;
  steps: StepModule[];
  StepID: number;
  addStep: number;
  stepM: StepModule;
  Stepid:number;
  Dropdowns:Dropdown_M[];

  constructor(private router: Router, private route: ActivatedRoute, global: AllProject, private location: Location) {
    this.projects = global.Projects;
    this.currentProjectId = parseInt(this.route.params["value"].projectid);
    this.currentScenarioId = parseInt(this.route.params["value"].scenarioid);
    this.CaseId = parseInt(this.route.params["value"].caseid);
    this.project = this.projects[this.currentProjectId - 1];
    this.scenario = this.project.scenarios[this.currentScenarioId - 1];
    this.Dropdowns=[];
    if (this.CaseId > this.scenario.cases.length) {
      this.onecase = {
        case_id: this.currentScenarioId + '-' + this.CaseId,
        case_name: '',
        case_description: '',
        case_actual_result: '',
        case_expect_result: '',
        steps: []
      };

    } else {
      this.onecase = this.scenario.cases[this.CaseId - 1];
      this.steps = this.onecase.steps;
      this.addStep = 1;
    }
  }

  ngOnInit() {
  }
  createcase(): void {
    if (this.CaseId > this.scenario.cases.length) {
      this.scenario.cases.push(this.onecase)
    } else {
      this.scenario.cases[this.CaseId - 1] = this.onecase;
    }
    this.location.back();
  }
  showStepDialog() {
    this.stepM={ order: 0, action: '', wait:'',enterValue: '', type: '', typePath: '', steps_result:'' ,textTag:''};
    this.Dropdowns=[];
    this.Stepid=this.steps.length+1;
    this.StepID = 0;
    this.Stepdisplay = true;
  }
  removeStep(i) {
    this.onecase.steps.forEach(t => {
      t.order == i

    });
  }
  editStep(i) {
    this.stepM=this.steps[i-1];
    this.Dropdowns.push({id:1,name:Operations.find(t=>t.label==this.stepM.action).label});
    this.Dropdowns.push({id:2,name:SelectedItem.find(t=>t.label==this.stepM.type).label});
    this.Dropdowns.push({id:3,name:SelectedItem2.find(t=>t.label==this.stepM.textTag).label});
    this.StepID = i;
    this.Stepdisplay = true;
  }
  getStep(e) {
    this.stepM = e;
    if (this.StepID != 0) {
      let index=0;
      this.steps.forEach(t => {
        if (t.order == this.stepM.order) {        
          t.action = this.stepM.action;
          t.enterValue = this.stepM.enterValue;
          t.steps_result = this.stepM.steps_result;
          t.textTag = this.stepM.textTag;
          t.type = this.stepM.type;
          t.typePath = this.stepM.typePath;
          t.wait = this.stepM.wait;
        }
      });
    } else {
      this.steps.push(e);

    }
  }
  getdisplay(e) {
    if (e != null) {
      this.Stepdisplay = false;
    }
  }
}

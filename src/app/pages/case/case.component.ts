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
import { AWS_CONFIGURATION } from '../../../environments/environment';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {
  Stepdisplay: boolean = false;
  currentProjectId: string;
  currentScenarioId: string;
  CaseId: string;
  onecase: CaseModule;
  steps: StepModule[];
  StepID: number;
  addStep: number;
  stepM: StepModule;
  Stepid: number;
  Dropdowns: Dropdown_M[];
  exist = false;
  constructor(private router: Router, private route: ActivatedRoute, global: AllProject, private location: Location, private autotest: RunAutoTestService, private confirmationService: ConfirmationService) {
    // this.projects = global.Projects;
    this.currentProjectId = this.route.params["value"].projectName;
    this.currentScenarioId = this.route.params["value"].scenarioid;
    this.CaseId = this.route.params["value"].caseid;
    this.exist = this.route.params["value"].source == 'exist';
    
    this.onecase = {
      case_id: this.CaseId,
      case_name: '',
      case_description: '',
      case_expect_result: '',
      case_actual_result:'',
      case_runtime:'',
      case_starttime:'',
      steps:[]
    };
    // this.onecase = new CaseModule;
    // this.stepM = new StepModule;
    this.Dropdowns = [];
    this.steps=[];
    this.autotest.GetCaseById(this.CaseId, (error, result) => {
      this.onecase = new CaseModule;
      this.onecase.case_id = result.Item.ID;
      this.onecase.case_name = result.Item.Name;
      this.onecase.case_description = result.Item.Description;
      this.onecase.case_expect_result = result.Item.Expect_result;
      this.onecase.case_actual_result = result.Item.Actual_result;
      this.onecase.case_runtime= result.Item.RunTime;
      this.onecase.case_starttime= result.Item.Starttime;
      this.onecase.steps=result.Item.Steps;
      if(this.onecase.steps!=null&&this.onecase.steps!=undefined){
        this.steps=this.onecase.steps;
      }
    });
    if(this.exist){
      this.addStep=1;
    }else{

    }
  }

  ngOnInit() {
    
  }
  createcase(): void {
    let params = {
      TableName: AWS_CONFIGURATION.CASETABLENAME,
      Item: {
        ID:this.CaseId,
        Name: this.onecase.case_name,
        Description: this.onecase.case_description,
        Expect_result: this.onecase.case_expect_result,
        Actual_result: this.onecase.case_actual_result,
        Starttime: this.onecase.case_starttime,
        RunTime:this.onecase.case_runtime,
        Steps: []
      }
    };
    if (this.exist) {
      let Casesparams = {
        TableName: AWS_CONFIGURATION.CASETABLENAME,
        Key: { ID: this.CaseId },
        AttributeUpdates: {
          'steps': {
            Action: 'PUT',
            Value: this.steps
          },
        }
      };
      this.autotest.UpdateProject(Casesparams);

    } else {
      let scenarioparams = {
        TableName: AWS_CONFIGURATION.SCENARIOTABLENAME,
        Key: { ID: this.currentScenarioId },
        AttributeUpdates: {
          'Cases': {
            Action: 'ADD',
            Value: [this.CaseId]
          },
        }
      };
      this.autotest.UpdateProject(scenarioparams);
      this.autotest.CreateProject(params);
    }
    this.router.navigate(['/scenario', { projectName: this.currentProjectId , scenarioid: this.currentScenarioId , source: "exist" }]);
  }
  showStepDialog() {
    this.stepM={ order: 0, action: '', wait:'',enterValue: '', type: '', typePath: '', steps_result:'' ,textTag:''};
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
    this.stepM = this.steps[i - 1];
    this.Dropdowns = [];
    
    this.Dropdowns.push({ id: Operations.find(t => t.label == this.stepM.action).value.id, name: Operations.find(t => t.label == this.stepM.action).label });
    this.Dropdowns.push({ id: Operations.find(t => t.label == this.stepM.action).value.id, name: SelectedItem.find(t => t.label == this.stepM.type).label });
    this.Dropdowns.push({ id: Operations.find(t => t.label == this.stepM.action).value.id, name: SelectedItem2.find(t => t.label == this.stepM.textTag).label });
    this.StepID = i;
    this.Stepdisplay = true;
  }
  getStep(e) {
    this.stepM = e;
    if (this.StepID != 0) {
      let index = 0;
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

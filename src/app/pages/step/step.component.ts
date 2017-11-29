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
@Component({
  selector: 'case-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  // @Input() casestep: CaseModule;
  // @Output() protected case: EventEmitter<CaseModule> = new EventEmitter();
  operations = Operations;
  selectors = Selectors;
  selectItem = SelectedItem;
  selectedItem2:any;
  Selname: Dropdown_M;
  Selname2: Dropdown_M;
  currentProjectId: number;
  currentScenarioId: number;
  CaseId:number;
  projects: ProjectModule[];
  project: ProjectModule;
  scenario: ScenarioModule;
  onecase: CaseModule;
  newsteporder: number;
  constructor(private router: Router, private route: ActivatedRoute, global: AllProject,private location: Location) {
    this.projects = global.Projects;
    this.currentProjectId = parseInt(this.route.params["value"].projectid);
    this.currentScenarioId = parseInt(this.route.params["value"].scenarioid);
    this.CaseId = parseInt(this.route.params["value"].caseid);
    this.project = this.projects[this.currentProjectId - 1];
    this.scenario=this.project.scenarios[this.currentScenarioId - 1];
    if (this.CaseId > this.scenario.cases.length) {
      this.onecase = {
        case_id:this.currentScenarioId + '-' + this.CaseId,
        case_name: '',
        case_description: '',
        case_actual_result:'',
        case_expect_result:'',
        steps: [{ order: this.scenario.cases.length + 1, action: 'Click', wait:'',enterValue: '', type: 'ID', typePath: '', steps_result:'',textTag:'' }],
      };
    } else {
      this.onecase = this.scenario.cases[this.CaseId - 1];
    }
   }

  ngOnInit() {

  }

  addnew(): void {
    
    
    // this.casestep.steps.push({ order: this.casestep.steps.length + 1, action: 'Click', wait:'',enterValue: '', type: 'ID', typePath: '', steps_result: '',textTag:'' })
  }

  removeCurrent(): void {
    // if (this.casestep.steps.length > 1) {
    //   this.casestep.steps.pop();
    // }
  }
  createcase(): void {   
    if (this.CaseId > this.scenario.cases.length) {
      this.scenario.cases.push(this.onecase)
    } else {
      this.scenario.cases[this.CaseId - 1] = this.onecase;
    }
    this.location.back();
  }
 
  Selectonchange(): void {
    console.log(this.Selname);
    console.log(this.Selname.name);
    if (this.Selname.name == "Tag Name") {
      this.selectedItem2=SelectedItem2;
    }else{
      this.selectedItem2=null;
    }
  }
}

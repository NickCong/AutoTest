import { Component, EventEmitter, OnInit, Input, Output, OnChanges } from '@angular/core';
import * as $ from 'jquery'
import { StepModule } from '../../common/models/step.module'
import { Operations } from '../../common/models/step.operation.module'
import { CaseModule } from '../../common/models/case.module'
import { Dropdown_M } from '../../common/models/step.module'
import { SelectedItem } from '../../common/models/step.selector.module'
import { SelectedItem2 } from '../../common/models/step.selector.module'
import { Dropdown } from 'primeng/primeng';
@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  @Input() StepM: StepModule;
  @Input() Dropdowns: Dropdown_M[];
  @Input() StepID: number;
  @Input() Stepid: number;
  @Output() protected Step: EventEmitter<StepModule> = new EventEmitter();
  @Output() protected Stepdisplay: EventEmitter<boolean> = new EventEmitter();
  operations = Operations;
  selectItem = SelectedItem;
  selectedItem2 = SelectedItem2;
  Selname: Dropdown_M;
  Selname2: Dropdown_M;
  Selname3: Dropdown_M;
  setId: number;
  newsteporder: number;
  constructor() {
  
  }
  ngOnChanges(): void {
    if (this.Dropdowns != null && this.Dropdowns.length > 0) {
      this.Selname = this.Dropdowns[1];
      this.Selname2 = this.Dropdowns[2];
      this.Selname3 = this.Dropdowns[0];
      console.log(this.Selname)
    }
    if (this.StepM == undefined || this.StepM == null) {
      this.StepM = new StepModule;
    }
  }
  ngOnInit() {
    // if (this.Dropdowns != null && this.Dropdowns.length > 0) {
    //   this.Selname = this.Dropdowns[1];
    //   this.Selname2 = this.Dropdowns[2];
    //   this.Selname3 = this.Dropdowns[0];
    // }
    // if (this.StepM == undefined || this.StepM == null) {
    //   this.StepM = new StepModule;
    // }
  }
  addnew(): void {
    if (this.StepID == 0) {
      this.StepM.order = this.Stepid;
    }
    this.StepM.action = this.Selname3.name;
    this.StepM.type = this.Selname.name;
    this.StepM.textTag = this.Selname2.name;
    this.StepM.steps_result="start_test"
    
    this.Step.emit(this.StepM);
    this.Stepdisplay.emit(false);
  }
  closeStep() {
    this.Stepdisplay.emit(false);
  }
  Selectonchange(dd: Dropdown): void {
    console.log(dd.label);
  }
}

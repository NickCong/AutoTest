import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as $ from 'jquery'
import { StepModule } from '../../common/models/step.module'
import { Operations } from '../../common/models/step.operation.module'
import { Selectors } from '../../common/models/step.selector.module'
import { CaseModule } from '../../common/models/case.module';
@Component({
  selector: 'case-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css']
})
export class StepComponent implements OnInit {
  @Input() casestep: CaseModule;
  @Output() protected case: EventEmitter<CaseModule> = new EventEmitter();
  operations = Operations;
  selectors = Selectors;
  selectorType: '';
  selectOperation: '';
  constructor() { }

  ngOnInit() {
  }
  chooseSelector(type): void {
    this.selectorType = type;
  }
  chooseOperation(operate): void {
    this.selectOperation = operate;
  }
  addnew(): void {
    this.casestep.push({ order: this.casestep.length + 1, operate: 'Click', operatevalue: '', selector: 'ID', selectorvalue: '' })
  }

  removeCurrent(): void {
    if (this.casestep.length > 1) {
      this.casestep.pop();
    }
  }
  createcase(): void {
     $(".btn.btn-default").trigger("click");
    this.case.emit(this.casestep);
  }
}
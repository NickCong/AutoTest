import { Component, OnInit } from '@angular/core';
import { StepComponent } from '../step/step.component'
import { StepModule } from '../../common/models/step.module'
import { HttpModule }    from '@angular/http';
import { ScenarioModule } from '../../common/models/scenario.module';
import { CaseModule } from '../../common/models/case.module';
import { StepModule } from '../../common/models/step.module';
import { ProjectModule } from '../../common/models/project.module';
import * as $ from 'jquery'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
  project:ProjectModule;
  rootUrl:string;
  allcase = [];
  onecase: {name:'', description:'', steps:StepModule[]};
  newsteporder: number;
  constructor() {
    this.onecase = [{ order: 1, operate: 'Click', operatevalue: '', selector: 'ID', selectorvalue: '' }]
  }

  ngOnInit() {
    let self = this;
  }

  getNewCase(newCase): void {
    this.allcase.push(newCase);
    this.onecase = {name:'', description:'', steps:[{ order: 1, operate: 'Click', operatevalue: '', selector: 'ID', selectorvalue: '' }]};
  }
  exportTestCase():void{
    var aLink =<HTMLLinkElement>document.getElementById("testcasefile");
    let result = [];
    for (let i = 0; i < this.allcase.length; i++) {
      let steps = [];
      for (let j = 0; j < this.allcase[i].length; j++) {
        steps.push({ action: this.allcase[i][j].operate, enterValue: this.allcase[i][j].operatevalue, type: this.allcase[i][j].selector, typePath: this.allcase[i][j].selectorvalue})
      }
      console.log(steps)
      result.push({ base_url: this.rootUrl,casename: events: steps});
    }
    var content = JSON.stringify(result);
    var blob = new Blob([content]);
    //aLink.download = "TestCase.json";
  //aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute( 'href', URL.createObjectURL(blob));
    aLink.setAttribute( 'download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
}

import { Component, OnInit } from '@angular/core';
import { ProjectModule } from '../../common/models/project.module';
import { AllProject } from '../../common/models/allproject.module';
import { Router } from '@angular/router';
import * as $ from 'jquery'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects:AllProject;
  private router:Router
  constructor() {

  }

  ngOnInit() {

  }

  editProject(project: ProjectModule): void{
     this.router.navigate(['/project', project.project_air_id]);
  }

  viewProject(project:ProjectModule, IsView: number): void{
     this.router.navigate(['/project', project.project_air_id]);
  }



  exportSelectProject():void{
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

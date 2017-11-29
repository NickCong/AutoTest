import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StepComponent } from '../step/step.component'
import { StepModule } from '../../common/models/step.module'
import { HttpModule } from '@angular/http';
import { ScenarioModule } from '../../common/models/scenario.module';
import { ProjectModule } from '../../common/models/project.module';
import { AllProject } from '../../common/models/allproject.module';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {

  currentProjectIdstr: string;
  currentProjectId: number;
  currentProject: ProjectModule;
  scenario: ScenarioModule;
  projects: ProjectModule[];
  newproject_air_id: number;
  newscenarioid: number;
  constructor(private router: Router, private route: ActivatedRoute, global: AllProject, private autotest: RunAutoTestService) {
    this.projects = global.Projects;
    this.route.paramMap
      .switchMap((params: ParamMap) => params.getAll('id'))
      .subscribe(h => this.currentProjectIdstr = h);
    console.log(this.currentProjectIdstr);
    this.newproject_air_id = parseInt(this.currentProjectIdstr);
    this.currentProjectId = parseInt(this.currentProjectIdstr);
    if (this.newproject_air_id > 0) {
      this.currentProject = this.projects[this.newproject_air_id - 1];
      this.newscenarioid = this.currentProject.scenarios.length + 1;
    }
    else {
      this.currentProject = {
        base_url: '', user: '', password: '',
        project_name: '',
        project_air_id: '',
        project_description: '',
        scenarios: []
      }
      this.newproject_air_id = this.projects.length + 1;
      this.newscenarioid = 1;
    }
  }

  ngOnInit() {
    /*this.route.paramMap
      .switchMap((params: ParamMap) => this.heroService.getHeroes3(+params.getAll('id')))
      .subscribe(h => this.hero = h);*/

  }
  editScenario(scenarioid): void {
    this.router.navigate(['/scenario', { projectid: this.newproject_air_id, scenarioid: scenarioid }]);
  }
  runScenario(scenarioindex): void {
    let result = this.currentProject;
    let runscenario = this.currentProject.scenarios[scenarioindex];
    result.scenarios = [runscenario];
    this.autotest.Run([result]).then(result => {
      if (result) {
        alert('AutoTest Finished!');
      }
    });
  }
  exportAllScenario(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    var content = JSON.stringify([this.currentProject]);
    var blob = new Blob([content]);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
  exportScenario(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let selectedscenarios = [];
    let self = this;
    let selectedproject =this.currentProject;
    $('.scenariodetail.ViewListCss.col-xs-6.caseinfo input').each(function(index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        selectedscenarios.push(self.currentProject.scenarios[index]);
      }
    });
    selectedproject.scenarios= selectedscenarios;
    var content = JSON.stringify([selectedproject]);
    var blob = new Blob([content]);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
  newScenario(): void {
    this.router.navigate(['/scenario', { projectid: this.newproject_air_id, scenarioid: this.newscenarioid }]);
  }
  saveProject(): void {
    this.currentProject.project_air_id = this.newproject_air_id.toString();
    this.currentProjectId = this.newproject_air_id;
    if (this.currentProjectId > this.projects.length) {
      this.projects.push(this.currentProject);
    }
    else {
      this.projects[this.currentProjectId - 1] = this.currentProject;
    }

    this.router.navigate(['/home']);
    $("#UploadRow").removeClass("hidden");
  }
}

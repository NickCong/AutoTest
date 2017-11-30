import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StepComponent } from '../step/step.component'
import { StepModule } from '../../common/models/step.module'
import { HttpModule } from '@angular/http';
import { ScenarioModule } from '../../common/models/scenario.module';
import { ProjectModule } from '../../common/models/project.module';
import { AllProject } from '../../common/models/allproject.module';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
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
  constructor(private router: Router, private route: ActivatedRoute, private global: AllProject, private autotest: RunAutoTestService, private confirmationService: ConfirmationService) {
    this.projects = this.global.Projects;
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
    let result = {
      base_url: this.currentProject.base_url, user: this.currentProject.user, password: this.currentProject.password,
      project_name: this.currentProject.project_name,
      project_air_id: this.currentProject.project_air_id,
      project_description: this.currentProject.project_description,
      scenarios: []
    };
    let runscenario = this.currentProject.scenarios[scenarioindex];
    result.scenarios = [runscenario];
    let self = this;
    let needdownload = false;
    for (let i = 0; i<runscenario.cases.length; i++) {
      for (let j =0; j<runscenario.cases[i].steps.length; j++) {
        if (runscenario.cases[i].steps[j].action == 'Download') {
          needdownload = true;
          break;
        }
      }
    }
    if (needdownload) {
      this.autotest.Run([result]).then(result => {
        if (result) {
          self.confirmationService.confirm({
            message: 'Are you sure that you want to update the scenario test result?',
            accept: () => {
              self.RefreshProject();
            }
          });
        }
      });
    }
    else {
      this.autotest.RunPhantomjs([result]).then(result => {
        if (result) {
          self.confirmationService.confirm({
            message: 'Are you sure that you want to update the scenario test result?',
            accept: () => {
              self.RefreshProject();
            }
          });
        }
      });
    }
  }
  RefreshProject(): void {
    this.autotest.GetTestResult().then(response => {
      let project = JSON.parse(response);
      this.currentProject.scenarios[project[0].scenarios[0].scenario_id - 1] = project[0].scenarios[0];
      this.global.Projects[this.currentProjectId - 1] = this.currentProject;
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

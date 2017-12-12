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
import { AWS_CONFIGURATION } from '../../../environments/environment';
import 'rxjs/add/operator/switchMap';
import * as $ from 'jquery'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {

  ISView = false;
  ISEidt = false;
  Exist = false;
  currentProjectName: string;
  currentProject: ProjectModule;
  scenario: ScenarioModule;
  projects: ProjectModule[];
  newscenarioid: number;
  constructor(private router: Router, private route: ActivatedRoute, private autotest: RunAutoTestService, private confirmationService: ConfirmationService) {
    this.currentProjectName = this.route.params["value"].name;
    this.ISView = this.route.params["value"].IsView == 'true';
    this.ISEidt = this.route.params["value"].IsView == 'false';
    this.currentProject = {
      base_url: '', user: '', password: '',
      project_name: '',
      project_air_id: '',
      project_description: '',
      scenario_count:'',
      scenarioIDs:[],
      scenarios: []
    }
    let self = this;
    this.autotest.CheckProjectExist(self.currentProjectName, function (err, data) {
      if (!err) {
        console.log(data);
        for (let i = 0; i < data.Count; i++) {
          if (data.Items[i].ProjectName == self.currentProjectName) {
            self.Exist =true;
            self.autotest.GetProjectByName(self.currentProjectName,(error, result) => {
              self.currentProject =  new ProjectModule;
              self.currentProject.base_url = result.Item.BaseUrl;
              self.currentProject.project_name = result.Item.ProjectName;
              self.currentProject.project_description = result.Item.Description;
              self.currentProject.user = result.Item.User;
              self.currentProject.password = result.Item.Password;
              self.currentProject.scenarioIDs = result.Item.ScenarioIDs;
              self.currentProject.scenario_count = result.Item.ScenarioIDs.length;
            });
            break;
          }
        }
      }     
    });    
  }

  ngOnInit() {
    /*this.route.paramMap
      .switchMap((params: ParamMap) => this.heroService.getHeroes3(+params.getAll('id')))
      .subscribe(h => this.hero = h);*/

  }
  editScenario(scenarioid): void {
    this.router.navigate(['/scenario', { projectName: this.currentProjectName, scenarioid: scenarioid, source:"exist" }]);
  }
  runScenario(scenarioindex): void {
    let result = {
      base_url: this.currentProject.base_url, user: this.currentProject.user, password: this.currentProject.password,
      project_name: this.currentProject.project_name,
      project_air_id: this.currentProject.project_air_id,
      project_description: this.currentProject.project_description,
      scenario_count:'0',
      scenarioIDs:[],
      scenarios: []
    };
    let runscenario = this.currentProject.scenarios[scenarioindex];
    result.scenarios = [runscenario];
    let self = this;
    let needdownload = false;
    for (let i = 0; i < runscenario.cases.length; i++) {
      for (let j = 0; j < runscenario.cases[i].steps.length; j++) {
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
    let selectedproject = this.currentProject;
    $('.scenariodetail.ViewListCss.col-xs-6.caseinfo input').each(function (index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        selectedscenarios.push(self.currentProject.scenarios[index]);
      }
    });
    selectedproject.scenarios = selectedscenarios;
    var content = JSON.stringify([selectedproject]);
    var blob = new Blob([content]);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
  newScenario(): void {
    this.router.navigate(['/scenario', { projectName: this.currentProjectName, scenarioid: this.autotest.GenerateUUID(), source:"new" }]);
  }
  saveProject(): void {
    var params = {
      TableName : AWS_CONFIGURATION.PROJECTTABLENAME,
      Item: {
        ProjectName: this.currentProject.project_name,
        Description: this.currentProject.project_description,
        User: this.currentProject.user,
        Password: this.currentProject.password,
        BaseUrl: this.currentProject.base_url,
        ScenarioIDs: [],
        ManageGroup: []
      }
    };
    this.autotest.CreateProject(params);
    this.router.navigate(['/home']);
    $("#UploadRow").removeClass("hidden");
  }
}

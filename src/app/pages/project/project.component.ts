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
      scenario_count: '',
      scenarioIDs: [],
      scenarios: []
    }
  }

  ngOnInit() {
    /*this.route.paramMap
      .switchMap((params: ParamMap) => this.heroService.getHeroes3(+params.getAll('id')))
      .subscribe(h => this.hero = h);*/
    let self = this;
    // this.autotest.CheckProjectExist(self.currentProjectName, function (err, data) {
    // if (!err) {
    // console.log(data);
    // for (let i = 0; i < data.Count; i++) {
    // if (data.Items[i].ProjectName == self.currentProjectName) {
    // self.Exist =true;
    self.autotest.GetProjectByName(self.currentProjectName, (error, result) => {
      self.currentProject.base_url = result.Item.BaseUrl;
      self.currentProject.project_name = result.Item.ProjectName;
      self.currentProject.project_description = result.Item.Description;
      self.currentProject.user = result.Item.User;
      self.currentProject.password = result.Item.Password;
      self.currentProject.scenarioIDs = result.Item.ScenarioIDs;
      self.currentProject.scenario_count = result.Item.ScenarioIDs.length;
      self.currentProject.scenarios = [];
      for (let j = 0; j < result.Item.ScenarioIDs.length; j++) {
        self.autotest.GetScenarioById(result.Item.ScenarioIDs[j], (err: any, data: any) => {
          if (err) {
            console.log(err)
          }
          else {
            let scenario = new ScenarioModule;
            scenario.scenario_id = data.Item.ID;
            scenario.scenario_order = data.Item.Order;
            scenario.scenario_name = data.Item.SName;
            scenario.scenario_description = data.Item.Description;
            scenario.scenario_url = [];
            scenario.cases = [];
            self.currentProject.scenarios.push(scenario);
            console.log('scenario ' + j);
            console.log(self.currentProject);
          }
        })
      }
    });
    // break;
    // }
    // }
    // }
    // });

  }
  editScenario(scenarioid): void {
    this.router.navigate(['/scenario', { projectName: this.currentProjectName, scenarioid: scenarioid, source: "exist" }]);
  }
  runScenario(scenarioID): void {
    let result = {
      projectName: this.currentProjectName,
      scenarioID: scenarioID
    }
    let self = this;
    this.autotest.Run(result).then(data => {
      if (data) {
        self.RefreshProject();
      }
    });
  }

  deleteScenario(scenarioid: string): void {
    let self = this;
    this.autotest.GetScenarioById(scenarioid, (error, result) => {
      result.Item.Cases;
      for (let i = 0; i < result.Item.Cases.length; i++) {
        let params = {
          TableName: AWS_CONFIGURATION.CASETABLENAME,
          Key: {
            'ID': result.Item.Cases[i],
          },
        }
        self.autotest.RemoveCase(params);
      }
    });
    let params = {
      TableName: AWS_CONFIGURATION.SCENARIOTABLENAME,
      Key: {
        'ID': scenarioid,
      },
    }
    this.autotest.RemoveCase(params);
  }
  RefreshProject(): void {
    this.autotest.GetTestResult().then(response => {
      //let project = JSON.parse(response);
      //this.currentProject.scenarios[project[0].scenarios[0].scenario_id - 1] = project[0].scenarios[0];
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
    this.router.navigate(['/scenario', { projectName: this.currentProjectName, scenarioid: this.autotest.GenerateUUID(), source: "new" }]);
  }
  saveProject(): void {
    var params = {
      TableName: AWS_CONFIGURATION.PROJECTTABLENAME,
      Item: {
        ProjectName: this.currentProject.project_name,
        Description: this.currentProject.project_description,
        User: this.currentProject.user,
        Password: this.currentProject.password,
        BaseUrl: this.currentProject.base_url,
        ScenarioIDs: this.currentProject.scenarioIDs,
        ManageGroup: []
      }
    };
    this.autotest.CreateProject(params);
    this.router.navigate(['/home']);
    $("#UploadRow").removeClass("hidden");
  }

}

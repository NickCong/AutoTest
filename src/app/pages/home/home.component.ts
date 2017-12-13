import { Component, OnInit } from '@angular/core';
import { ProjectModule } from '../../common/models/project.module';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import { AllProject } from '../../common/models/allproject.module';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AWS_CONFIGURATION } from '../../../environments/environment';
//import {FileUploadModule} from 'primeng/primeng';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects: ProjectModule[];
  selectProjects: number[];
  files: any;

  constructor(private router: Router, private autotest: RunAutoTestService, private confirmationService: ConfirmationService) {
    this.projects=[];
    this.GetAllProject();
    this.selectProjects = [];
    this.files = [];
  }

  ngOnInit() {

  }

  newProject(): void {
    this.router.navigate(['/project', {name:'-1', IsView:false}]);
  }

  editProject(project: ProjectModule): void {
    this.router.navigate(['/project', {name:project.project_name, IsView:false}]);
  }

  viewProject(project: ProjectModule, IsView): void {
    this.router.navigate(['/project', {name:project.project_name, IsView:true}]);
  }

  removeProject(project: ProjectModule): void {
    for(let ps in project.scenarioIDs)
    {
      this.removeScenario(ps);
    }
    let params = {
      TableName: AWS_CONFIGURATION.PROJECTTABLENAME,
      Key: {
        'ProjectName': project.project_name,
      },
    }
    this.autotest.RemoveProject(params);
  }

  removeScenario(scenarioid: string): void {
    let self = this;
    this.autotest.GetScenarioById(scenarioid, (error, result) => {
      result.Item.Cases;
      for(let i=0;i<result.Item.Cases.length;i++){
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

  exportSelectProject(): void {
    let result = [];
    let self = this;
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function (index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        result.push(self.projects[index].project_name)
      }
    });
    this.autotest.Export(result);
    /*let aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let result = [];
    let self = this;
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function (index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        result.push(self.projects[index])
      }
    });

    let content = JSON.stringify(result);
    let blob = new Blob([content]);
    //aLink.download = "TestCase.json";
    //aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);*/
  }
  runSelectProject(): void {
    $("#UploadRow").addClass("hidden");
    let result = [];
    let self = this;
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function (index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        result.push(self.projects[index].project_name)
      }
    });
    this.autotest.RunProjects(result);
  }
  RefreshProject(): void {
    $("#UploadRow").addClass("hidden");
    this.autotest.GetTestResult().then(response => { this.projects = JSON.parse(response); });
  }
  myUploader(event) {
    if (event.files != null) {
      $("#UploadRow").addClass("hidden");
      let self = this;
      this.autotest.UploadFile(event.files[0]).then(function (response) {
        let result = JSON.parse(response);
        for (let i=0;i<result.length;i++) {
          let params = {
            TableName: AWS_CONFIGURATION.PROJECTTABLENAME,
            Key: {
              'ProjectName': result[i].project_name,
              "Description": result[i].project_description,
              "PUser": result[i].user,
              "Password": result[i].password,
              "BaseUrl": result[i].base_url,
              "ScenarioIDs": [],
              "ManageGroup": []
            },
          }
          self.autotest.CreateProject(params);
        }
        self.GetAllProject();
      })
    };

    //event.files == files to upload
  }
  private GetAllProject(){
    let params = {
      AttributesToGet: [
        'ProjectName',
        "Description",
        "PUser",
        "Password",
        "BaseUrl",
        "ScenarioIDs"
      ],
      TableName: AWS_CONFIGURATION.PROJECTTABLENAME,
    };
    let self = this;
    this.autotest.GetAllProject(params,function (err, data) {
      if (err) {
        // an error occurred
        this.projects=[];
        console.log(err, err.stack);
      }
      else {
        // successful response
        console.log(data);
        let projects=[];
        for (let i = 0; i < data.Count; i++) {
          let project = new ProjectModule;
          project.base_url = data.Items[i].BaseUrl;
          project.project_name = data.Items[i].ProjectName;
          project.project_description = data.Items[i].Description;
          project.user = data.Items[i].PUser;
          project.password = data.Items[i].Password;
          projects.push(project)
        }
        self.projects = projects;
      }
    });
  }
  UploadProject() {
    $("#UploadRow").removeClass("hidden");
  }
}

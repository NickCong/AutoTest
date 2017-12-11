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

  TestDynamoDB(): void {
    this.autotest.CreateTable();
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
    var params = {
      TableName: AWS_CONFIGURATION.PROJECTTABLENAME,
      Key: {
        'ProjectName': project.project_name,
      },
    }
    this.autotest.RemoveProject(params);
  }

  exportSelectProject(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let result = [];
    let self = this;
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function (index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        result.push(self.projects[index])
      }
    });

    var content = JSON.stringify(result);
    var blob = new Blob([content]);
    //aLink.download = "TestCase.json";
    //aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
  runSelectProject(): void {
    $("#UploadRow").addClass("hidden");
    let result = [];
    let self = this;
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function (index, ele) {
      if ((<HTMLInputElement>ele).checked) {
        result.push(self.projects[index])
      }
    });
    this.autotest.Run(result).then(result => {
      if (result) {
        //alert('AutoTest Finished!');
        this.confirmationService.confirm({
          message: 'Are you sure that you want to update the project test result?',
          accept: () => {
            self.RefreshProject();
          }
        });
      }
    });
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
              "User": result[i].user,
              "Password": result[i].password,
              "BaseUrl": result[i].base_url,
              "ScenarioIDs": [],
              "ManageGroup": []
            },
          }
          this.autotest.CreateProject(params);
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
        "User",
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
          project.user = data.Items[i].User;
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

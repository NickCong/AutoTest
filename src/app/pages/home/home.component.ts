import { Component, OnInit } from '@angular/core';
import { ProjectModule } from '../../common/models/project.module';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import { AllProject } from '../../common/models/allproject.module';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';
//import {FileUploadModule} from 'primeng/primeng';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects: any[];
  selectProjects: number[];
  files: any;

  constructor(private router: Router, private global: AllProject, private autotest: RunAutoTestService,private confirmationService: ConfirmationService) {
    this.projects = global.Projects;
    this.selectProjects = [];
    this.files = [];
  }

  ngOnInit() {

  }

  newProject(): void {
    this.router.navigate(['/project', '-1']);
  }

  editProject(project: ProjectModule): void {
    this.router.navigate(['/project', project.project_air_id]);
  }

  viewProject(project: ProjectModule, IsView: number): void {
    this.router.navigate(['/project', project.project_air_id]);
  }
  removeProject(project: ProjectModule): void {
    let newprojects = [];
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].project_air_id != project.project_air_id) {
        newprojects.push(this.projects[i]);
      }
    }
    this.projects = newprojects;
    this.global.Projects = this.projects;
  }

  exportSelectProject(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let result = [];
    let self = this;
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function(index, ele) {
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
    $('.project.ViewListCss.col-xs-6.caseinfo input').each(function(index, ele) {
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
    this.autotest.GetTestResult().then(response => { this.projects = JSON.parse(response); this.global.Projects = JSON.parse(response); });
  }
  myUploader(event) {
    if (event.files != null) {
      $("#UploadRow").addClass("hidden");
      let self = this;
      this.autotest.UploadFile(event.files[0]).then(function(response) {
        self.projects = JSON.parse(response);
        self.global.Projects = JSON.parse(response);
      })
    };

    //event.files == files to upload
  }
  UploadProject() {
    $("#UploadRow").removeClass("hidden");
  }
}

import { Component, OnInit } from '@angular/core';
import { ProjectModule } from '../../common/models/project.module';
import { RunAutoTestService } from '../../common/services/runautotest.service';
import { AllProject } from '../../common/models/allproject.module';
import { Router } from '@angular/router';
import * as $ from 'jquery';
//import {FileUploadModule} from 'primeng/primeng';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  projects: ProjectModule[];
  selectProjects: number[];

  constructor(private router: Router, global: AllProject, private autotest: RunAutoTestService) {
    this.projects = global.Projects;
    this.selectProjects = [];
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

  myUploader(event) {
    console.log(event.files[0])
    this.autotest.UploadFile(event.files[0]).then(heroes => this.projects = heroes);;
  }
  selectProject(id: number): void {
    this.selectProjects.push(id);
  }

  exportSelectProject(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let result = [];
    for (let index = 0; index < this.selectProjects.length; index++) {
      let temp = this.selectProjects[index]
      result.push(this.projects[temp - 1]);
    }
    var content = JSON.stringify(result);
    var blob = new Blob([content]);
    //aLink.download = "TestCase.json";
    //aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('href', URL.createObjectURL(blob));
    aLink.setAttribute('download', "TestCase.json");
    aLink.click();
    window.URL.revokeObjectURL(aLink.href);
  }
  runProject(): void {
    let content = JSON.stringify(this.projects);
    this.autotest.Run(this.projects);  
  }
}

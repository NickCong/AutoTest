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
  projects = AllProject;
  selectProjects=[];
  private router: Router
  constructor() {

  }

  ngOnInit() {

  }

  newProject(): void {
    this.router.navigate(['/project', 0]);
  }

  editProject(project: ProjectModule): void {
    this.router.navigate(['/project', project.project_air_id]);
  }

  viewProject(project: ProjectModule, IsView: number): void {
    this.router.navigate(['/project', project.project_air_id]);
  }

  selectProject(id: number): void {
    this.selectProjects.push(id);
  }

  exportSelectProject(): void {
    var aLink = <HTMLLinkElement>document.getElementById("testcasefile");
    let result: ProjectModule[];
    for (let index = 0; index< this.selectProjects.length;index++) {
      result.push(this.projects[index]);
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
}

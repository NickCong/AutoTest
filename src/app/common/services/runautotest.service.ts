import { Injectable } from '@angular/core';
import { ProjectModule } from '../models/project.module';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RunAutoTestService {
  constructor(private http: Http, private httpclient: HttpClient) { }
  Run(project: ProjectModule[]): Promise<ProjectModule[]> {
      let content = JSON.stringify(project);
      return this.http
      .get(`http://localhost:2752/home/StartAutoTest?testcase=${content}`)
      .toPromise()
      .then(response => response.json().data);
  }
  UploadFile(file): Promise<ProjectModule[]> {
    var fd = new FormData();
   fd.append("file", file);
    const req = new HttpRequest('POST', 'http://localhost:2752/home/UploadFile', fd);
    let a = [];
    this.httpclient.request(req).subscribe(response => a = response['result'] as ProjectModule[]);
    return Promise.resolve(a);
  }
  GetTestResult():Promise<ProjectModule[]> {
    return this.http
    .get(`http://localhost:2752/home/SycActualResult`)
    .toPromise()
    .then(response => response.json().data as ProjectModule[]);
  }
}

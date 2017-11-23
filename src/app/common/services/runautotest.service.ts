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
    return this.http
      .get(`http://localhost:52185/home/StartAutoTest?testcase=${project}`)
      .toPromise()
      .then(response => response.json().data as ProjectModule[]);
  }
  UploadFile(file): Promise<ProjectModule[]> {
    const req = new HttpRequest('POST', 'http://localhost:52185/home/UploadFile', file);
    let a=[];
    this.httpclient.request(req).subscribe(response => a = response['result'] as ProjectModule[]);
    return Promise.resolve(a);
  }
}

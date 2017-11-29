import { Injectable } from '@angular/core';
import { ProjectModule } from '../models/project.module';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RunAutoTestService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http, private httpclient: HttpClient) { }
  Run(project: ProjectModule[]): Promise<string> {
    let content = JSON.stringify(project);
    return this.http
      .post(`http://localhost:52185/home/StartAutoTest`, { testcase: content }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
    /*let content = JSON.stringify(project);
    return this.http
    .post(`http://localhost:2752/home/StartAutoTest`, content ,{headers: this.headers})
    .toPromise()
    .then(response => response.json());*/
    /*const req = new HttpRequest('POST', 'http://localhost:2752/home/StartAutoTest', project);
    let a = [];
    this.httpclient.request(req).subscribe(response => a = response['result']);
    return Promise.resolve(a);*/
  }
  UploadFile(file): Promise<string> {
    var fd = new FormData();
    fd.append("file", file);
  /*  const req = new HttpRequest('POST', 'http://localhost:2752/home/UploadFile', fd);
    let a ='';
    this.httpclient.request(req).subscribe(response =>  a = response['result']);
    return a;*/
    return this.http
    .post(`http://localhost:52185/home/UploadFile`, fd)
    .toPromise()
    .then(response => response.json())
  }
  GetTestResult(): Promise<string> {
    return this.http
      .get(`http://localhost:52185/home/SycActualResult`)
      .toPromise()
      .then(response => response.json());
  }
}

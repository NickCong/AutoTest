import { Injectable } from '@angular/core';
import { ProjectModule } from '../models/project.module';
import { Http }       from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class RunAutoTestService {
  constructor(private http: Http) {}
  Run(project:ProjectModule[]): ProjectModule[] {
    return this.http
               .get(`http://localhost:2752/home/StartAutoTest?testcase=${project}`)
               .map(response => response.json().data as ProjectModule[]);
  }
  UploadFile(file): ProjectModule[] {
    return this.http
               .post(`http://localhost:2752/home/UploadFile/?file=${file}`)
               .map(response => response.json().data as ProjectModule[]);
  }
}

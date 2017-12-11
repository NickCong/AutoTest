import { Injectable } from '@angular/core';
import { ProjectModule } from '../models/project.module';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest } from '@angular/common/http';
import 'rxjs/add/operator/map';// import entire SDK
import { DynamoDBService } from './dynamodb.service';
import { AWS_CONFIGURATION } from '../../../environments/environment';
import { forEach } from '@angular/router/src/utils/collection';
import { asQueryList } from '@angular/core/src/view';


@Injectable()
export class RunAutoTestService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  PROJECTTABLENAME: string;
  constructor(private http: Http, private httpclient: HttpClient, private dynamoDB: DynamoDBService) {
    this.PROJECTTABLENAME = AWS_CONFIGURATION.PROJECTTABLENAME;
  }
  Run(project: ProjectModule[]): Promise<string> {
    let content = JSON.stringify(project);
    return this.http
      .post(`http://localhost:2752/home/StartAutoTest`, { testcase: content }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  RunPhantomjs(project: ProjectModule[]): Promise<string> {
    let content = JSON.stringify(project);
    return this.http
      .post(`http://localhost:2752/home/StartPhantomAutoTest`, { testcase: content }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  UploadFile(file): Promise<string> {
    var fd = new FormData();
    fd.append("file", file);
    /*  const req = new HttpRequest('POST', 'http://localhost:2752/home/UploadFile', fd);
      let a ='';
      this.httpclient.request(req).subscribe(response =>  a = response['result']);
      return a;*/
    return this.http
      .post(`http://localhost:2752/home/UploadFile`, fd)
      .toPromise()
      .then(response => response.json())
  }
  GetTestResult(): Promise<string> {
    return this.http
      .get(`http://localhost:2752/home/SycActualResult`)
      .toPromise()
      .then(response => response.json());
  }

  GetAllProject(params, callback: (err: any, data: any) => void): void {
    this.dynamoDB.scanData(params, callback);
  }
  GenerateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  GetProjectByName(name: string, callback: (err: any, data: any) => void): void {
    var params = {
      TableName: 'ATCProject',
      Key: {
        ProjectName: name
      }
    };
    this.dynamoDB.readData(params, callback);
  }

  CheckProjectExist(name: string, callback: (err: any, data: any) => void): any {
    let params = {
      /* AttributesToGet: [
         'Name',
         "Description"
       ],*/
      ExpressionAttributeValues: {
        ":a": name
      },
      FilterExpression: "ProjectName = :a",
      TableName: this.PROJECTTABLENAME
    };
    this.dynamoDB.scanData(params, callback);
  }

  CreateProject(params: any): void {
    let project: ProjectModule;
    this.dynamoDB.insertData(params, (error, result) => {

    });
  }

  RemoveProject(params: any): void {
    let project: ProjectModule;
    this.dynamoDB.deleteData(params, (error, result) => {

    });
  }

  CreateTable(): void {
    var params = {
      AttributeDefinitions: [
        {
          AttributeName: 'ProjectName',
          AttributeType: "S"
        }
      ],
      KeySchema: [
        {
          AttributeName: "ProjectName",
          KeyType: "HASH"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      TableName: this.PROJECTTABLENAME
    };

    this.dynamoDB.createTable(params, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        console.log('Create table failed');
      }
      else {
        console.log('Create table successfully');
        console.log(data);           // successful response
      }
    });
  }
}

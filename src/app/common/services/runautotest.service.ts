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
  SCENARIOTABLENAME: string;
  CASETABLENAME:string;
  constructor(private http: Http, private httpclient: HttpClient, private dynamoDB: DynamoDBService) {
    this.PROJECTTABLENAME = AWS_CONFIGURATION.PROJECTTABLENAME;
    this.SCENARIOTABLENAME = AWS_CONFIGURATION.SCENARIOTABLENAME;
    this.CASETABLENAME = AWS_CONFIGURATION.CASETABLENAME;
  }
  Export(project: any): void {
    //  accessKeyId: 'AKIAIGJDIEUEGPI5E37Q',//AKIAI3H5QDUXBDRWITQQ
      //: '4L7htZPKJPTX5nm6JvULDUyguKMpC2L+UA3PfZUD',//u1n19AxPm7pMRVcXivU7CRm5LMVVSkLiHTPADb3T
     this.http
      .post(`http://localhost:52894/home/Export`, { projectName: project }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  RunProjects(project: any): void {
    this.http
      .post(`http://localhost:52894/home/StartAutoTestProjects`, { projectName: project }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  RunProject(project: string): void {
    this.http
      .post(`http://localhost:52894/home/StartAutoTestProject`, { projectName: project }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  RunScenario(projectName: string, scenarioID: string): void {
    this.http
      .post(`http://localhost:52894/home/StartAutoTestScenario`, { projectName: projectName, scenarioID:scenarioID }, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  RunCase(projectName: string, scenarioID: string, caseID: string): void {
    this.http
      .post(`http://localhost:52894/home/StartAutoTestCase`, { projectName: projectName, scenarioID:scenarioID, caseID: caseID}, { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }
  RunPhantomjs(project: any): Promise<string> {
    let content = JSON.stringify(project);
    return this.http
      .post(`http://localhost:52894/home/StartPhantomAutoTest`, { testcase: content }, { headers: this.headers })
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
      .post(`http://localhost:52894/home/UploadFile`, fd)
      .toPromise()
      .then(response => response.json())
  }
  GetTestResult(): Promise<string> {
    return this.http
      .get(`http://localhost:52894/home/SycActualResult`)
      .toPromise()
      .then(response => response.json());
  }

  GetAllProject(params, callback: (err: any, data: any) => void): void {
    this.dynamoDB.scanData(params, callback);
  }

  GenerateUUID(): string {
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
      TableName: this.PROJECTTABLENAME,
      Key: {
        ProjectName: name
      }
    };
    this.dynamoDB.readData(params, callback);
  }

  GetScenarioById(id: string, callback: (err: any, data: any) => void): void {
    var params = {
      TableName: this.SCENARIOTABLENAME,
      Key: {
        ID: id
      }
    };
    this.dynamoDB.readData(params, callback);
  }

  GetCaseById(id: string, callback: (err: any, data: any) => void): void {
    var params = {
      TableName: this.CASETABLENAME,
      Key: {
        ID: id
      }
    };
    this.dynamoDB.readData(params, callback);
  }
  UpdateProJect(params: any): void {
    this.dynamoDB.updateData(params, (error, result) => {
    });
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

  CreateScenario(params: any): void {
    this.dynamoDB.insertData(params, (error, result) => {
      if(error)
      {
        console.log(error)
      }
      else{
        console.log(result)
      }
    });
  }

  CreateProject(params: any): void {
    this.dynamoDB.insertData(params, (error, result) => {
    });
  }

  UpdateProject(params: any): void {
    this.dynamoDB.updateData(params, (error, result) => {
    });
  }

  RemoveProject(params: any): void {
    this.dynamoDB.deleteData(params, (error, result) => {
    });
  }

  RemoveScenario(params: any): void {
    this.dynamoDB.deleteData(params, (error, result) => {
    });
  }

  RemoveCase(params: any): void {
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpModule }    from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRouteModule }     from './app.route';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ExtensionComponent } from './pages/extension/extension.component';
import { StepComponent } from './pages/step/step.component';
import { ProjectComponent } from './pages/project/project.component';
import { ScenarioComponent } from './pages/scenario/scenario.component';
import { AllProject } from './common/models/allproject.module';
import { RunAutoTestService } from './common/services/runautotest.service';
import { DynamoDBService } from './common/services/dynamodb.service';
//import {FileUploadModule} from 'primeng/primeng';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';
import {FileUploadModule} from 'primeng/primeng';
import { CaseComponent } from './pages/case/case.component';
import {DialogModule} from 'primeng/primeng';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExtensionComponent,
    StepComponent,
    ProjectComponent,
    ScenarioComponent,
    CaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRouteModule,
    FileUploadModule,
    AllProject,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule

  ],
  providers: [RunAutoTestService,ConfirmationService,DynamoDBService],
  bootstrap: [AppComponent]
})
export class AppModule { }

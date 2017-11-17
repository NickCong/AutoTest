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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExtensionComponent,
    StepComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRouteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { ProjectModule } from '../../common/models/project.module';
import { NgModule } from '@angular/core';
@NgModule({})
export class AllProject {
   Projects: ProjectModule[];
constructor() {
  this.Projects = [];
}
}

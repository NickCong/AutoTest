import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectComponent } from './pages/project/project.component';
import { ScenarioComponent } from './pages/scenario/scenario.component';
import { ExtensionComponent } from './pages/extension/extension.component';
import { StepComponent } from './pages/step/step.component';
import { CaseComponent } from './pages/case/case.component';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'scenario', component: ScenarioComponent },
  { path: 'extension', component: ExtensionComponent },
  { path: 'Case', component: CaseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule { }

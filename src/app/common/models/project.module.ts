import { ScenarioModule } from './scenario.module'
export class ProjectModule{
  base_url: string;
  user: string;
  password: string;
  project_name: string;
  project_air_id: string;
  project_description: string;
  scenarios:ScenarioModule[]
}

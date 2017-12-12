import { CaseModule } from './case.module'
import { StepModule } from './step.module'
export class ScenarioModule {
   scenario_id:string;
   scenario_order:string;
   scenario_name:string;
   scenario_description:string;
   scenario_url:StepModule[];
   cases:CaseModule[];
 }

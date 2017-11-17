import { StepModule } from './step.module'
export class CaseModule {
  case_name: string,
  case_id: string,
  case_description: string,
  case_expect_result: string,
  case_actual_result: string,
  steps: StepModule[]
}

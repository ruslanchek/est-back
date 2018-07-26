import { EAgentType } from './agent.enum';

export interface IAgent {
  id: number;
  avatar: boolean;
  type: EAgentType;
  fullName: string;
  contact: string;
}
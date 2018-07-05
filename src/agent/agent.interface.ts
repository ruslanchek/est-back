import { EAgentType } from './agent.enum';

export interface IAgent {
  id: number;
  avatar: string;
  type: EAgentType;
  fullName: string;
  contact: string;
}
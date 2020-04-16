export * from './alunos.service';
import { AlunosService } from './alunos.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './default.service';
import { DefaultService } from './default.service';
export const APIS = [AlunosService, AuthService, DefaultService];

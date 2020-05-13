import { Pipe, PipeTransform } from '@angular/core';
import { Aluno } from 'src/app/rest-api';

@Pipe({ name: 'getClass' })
export class GetClassPipe implements PipeTransform {
  transform(value: Aluno): string {
    if (value.situacaoDoCurso === Aluno.SituacaoDoCursoEnum.Inativo) {
      return 'Aluno(a) inativo(a)';
    }

    return value.turmaAtual ? value.turmaAtual : 'Nenhuma turma foi definida!';
  }
}

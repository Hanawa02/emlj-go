import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStudentsState from './students.reducer';
import { StudentsState } from './students.reducer';
import { Aluno } from '../../rest-api';
import { Rent } from '../../shared/models/rent.model';

export const selectStudentsState = createFeatureSelector<StudentsState>(
  'students'
);

export const getAllStudents = createSelector(
  selectStudentsState,
  fromStudentsState.selectAll
);

export const getStudentsEntities = createSelector(
  selectStudentsState,
  fromStudentsState.selectEntities
);

export const getAllActiveStudents = createSelector(
  getAllStudents,
  (students) => {
    return students.filter(
      (item) => item.situacaoDoCurso === Aluno.SituacaoDoCursoEnum.Ativo
    );
  }
);

export const getSelectedStudent = createSelector(
  selectStudentsState,
  (state) => {
    if (state.entities && state.selectedStudentId) {
      return state.entities[state.selectedStudentId];
    }

    return null;
  }
);

export const getPendingRents = createSelector(getAllStudents, (students) => {
  const studentsWithRent = students.filter(
    (student) => student.emprestimos?.length > 0
  );

  const pendingRents: Rent[] = [];

  for (const student of studentsWithRent) {
    const studentPendingRents = student.emprestimos
      .filter((item) => !item.dataRetorno)
      .map((item) => {
        return {
          studentId: student.id.toString(),
          studentName: student.nome,
          rentDate: item.dataEmprestimo,
          comment: item.observacao,
          rentItem: item.titulo,
        };
      });

    pendingRents.push(...studentPendingRents);
  }

  return pendingRents;
});

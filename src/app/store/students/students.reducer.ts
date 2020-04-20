import { StudentsActions, StudentsActionTypes } from './students.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Aluno } from 'src/app/rest-api';

export const adapter: EntityAdapter<Aluno> = createEntityAdapter<Aluno>();

export interface StudentsState extends EntityState<Aluno> {
  selectedStudentId: string;
}

export const initialState: StudentsState = adapter.getInitialState({
  selectedStudentId: null,
});

export function reducer(
  state = initialState,
  action: StudentsActions
): StudentsState {
  switch (action.type) {
    case StudentsActionTypes.LoadStudentsSuccess:
      return adapter.setAll(action.payload.students, { ...state });

    case StudentsActionTypes.CreateStudentSuccess:
      return adapter.addOne(action.payload.student, {
        ...state,
      });

    case StudentsActionTypes.DeleteStudentSuccess:
      return adapter.removeOne(action.payload.studentId.toString(), {
        ...state,
      });

    case StudentsActionTypes.UpdateStudentSuccess:
      adapter.removeOne(action.payload.student.id.toString(), { ...state });

      return adapter.addOne(action.payload.student, {
        ...state,
      });

    case StudentsActionTypes.SelectStudent:
      return {
        ...state,
        selectedStudentId: action.payload.studentId,
      };

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

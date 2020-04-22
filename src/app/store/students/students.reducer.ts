import { StudentsActions, StudentsActionTypes } from './students.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Aluno } from 'src/app/rest-api';

export const adapter: EntityAdapter<Aluno> = createEntityAdapter<Aluno>();

export interface StudentsState extends EntityState<Aluno> {
  selectedStudentId: string;
  isLoading: boolean;
}

export const initialState: StudentsState = adapter.getInitialState({
  selectedStudentId: null,
  isLoading: false,
});

export function reducer(
  state = initialState,
  action: StudentsActions
): StudentsState {
  switch (action.type) {
    case StudentsActionTypes.LoadStudents:
      return { ...state, isLoading: true };

    case StudentsActionTypes.LoadStudentsSuccess:
      return adapter.setAll(action.payload.students, {
        ...state,
        isLoading: false,
      });

    case StudentsActionTypes.LoadStudentsError:
      return { ...state, isLoading: false };

    case StudentsActionTypes.CreateStudent:
      return { ...state, isLoading: true };

    case StudentsActionTypes.CreateStudentSuccess:
      return adapter.addOne(action.payload.student, {
        ...state,
        isLoading: false,
      });

    case StudentsActionTypes.CreateStudentError:
      return { ...state, isLoading: false };

    case StudentsActionTypes.DeleteStudent:
      return { ...state, isLoading: true };

    case StudentsActionTypes.DeleteStudentSuccess:
      return adapter.removeOne(action.payload.studentId.toString(), {
        ...state,
      });

    case StudentsActionTypes.DeleteStudentError:
      return { ...state, isLoading: false };

    case StudentsActionTypes.UpdateStudent:
      return { ...state, isLoading: true };

    case StudentsActionTypes.UpdateStudentSuccess:
      adapter.removeOne(action.payload.student.id.toString(), { ...state });

      return adapter.addOne(action.payload.student, {
        ...state,
      });

    case StudentsActionTypes.UpdateStudentError:
      return { ...state, isLoading: false };

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

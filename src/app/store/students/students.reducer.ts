import { StudentsActions, StudentsActionTypes } from './students.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Aluno } from 'src/app/rest-api';

export const adapter: EntityAdapter<Aluno> = createEntityAdapter<Aluno>();

export interface StudentsState extends EntityState<Aluno> {
  selected: Aluno;
}

export const initialState: StudentsState = adapter.getInitialState({
  selected: undefined,
});

export function reducer(
  state = initialState,
  action: StudentsActions
): StudentsState {
  switch (action.type) {
    case StudentsActionTypes.LoadStudentsSuccess:
      return adapter.setAll(action.payload.students, { ...state });

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

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { of, Observable } from 'rxjs';
import { StudentsState } from 'src/app/store/students/students.reducer';
import { Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroy } from '@ngrx-utils/store';
import { tap } from 'rxjs/operators';
import { Aluno } from 'src/app/rest-api';
import { getSelectedStudent } from 'src/app/store/students/students.selectors';
import { CreateStudentRequested } from 'src/app/store/students/students.actions';
import { MatDatepicker } from '@angular/material/datepicker';
import { CPFFormatPipe } from 'src/app/shared/pipes/cpf-format.pipe';

@Component({
  selector: 'app-student-item',
  templateUrl: './student-item.component.html',
  styleUrls: ['./student-item.component.scss'],
})
export class StudentItemComponent implements OnInit, OnDestroy {
  student: Aluno;

  studentForm: FormGroup;
  formErrors: any;
  descendencyEnum = Object.values(Aluno.DescendenciaEnum);
  ufEnum = Object.values(Aluno.UfEnum);
  statusEnum = Object.values(Aluno.SituacaoDoCursoEnum);
  semesterEnum = Object.values(Aluno.SemestreDeIngressoEnum);
  knowledgeLevelsEnum = Object.values(Aluno.ConversacaoEnum);

  studiedJapaneseBefore: boolean;

  @ViewChild('dataNascimentoDatePicker')
  dataNascimentoDatePicker: MatDatepicker<Date>;

  constructor(
    private store: Store<StudentsState>,
    private formBuilder: FormBuilder,
    private cpfFormaterPipe: CPFFormatPipe
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(getSelectedStudent),
        tap((student) => {
          this.student = student;
          // this.student = { id: 'testeId', nome: 'teste' };
        })
      )
      .subscribe();

    this.studentForm = this.formBuilder.group({
      nome: ['', [Validators.minLength(3), Validators.requiredTrue]],
      dataNascimento: ['', []],
      RG: ['', []],
      OrgaoEmissor: ['', []],
      CPF: ['', []],
      nacionalidade: ['', []],
      naturalidade: ['', []],
      profissao: ['', []],
      pai: ['', []],
      mae: ['', []],
      descendencia: ['', []],
      socioANBG: ['', []],
      endereco: ['', []],
      setor: ['', []],
      cep: ['', []],
      cidade: ['', []],
      uf: ['', []],
      telefone: ['', []],
      celular: ['', []],
      email: ['', [Validators.email]],
      jaEstudouJapones: ['', []],
      ondeEstudouJapones: ['', []],
      conversacao: ['', []],
      hiragana: ['', []],
      katakana: ['', []],
      kanji: ['', []],
      comoSoubeDaEscola: ['', []],
      anoDeIngresso: ['', []],
      semestreDeIngresso: ['', []],
      situacaoDoCurso: ['', []],
      turmaAtual: ['', []],
    });

    if (this.student) {
      this.addStudentValuesToForm();
    }

    this.studentForm.valueChanges
      .pipe(
        untilDestroy(this),
        tap(() => this.onFormValuesChanged())
      )
      .subscribe();
  }

  onFormValuesChanged(): void {
    this.studiedJapaneseBefore = this.studentForm.value.jaEstudouJapones;

    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      // Clear previous errors
      this.formErrors[field] = {};
      // Get the control
      const control = this.studentForm.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  canDeactivate(): Observable<boolean> {
    return of(true);
  }

  addStudentValuesToForm() {}

  openDataNascimentoDatePicker() {
    this.dataNascimentoDatePicker.open();
  }

  formatCPF(): void {
    this.studentForm.value.CPF = this.cpfFormaterPipe.transform(
      this.studentForm.value.CPF,
      true
    );
  }

  save() {
    this.store.dispatch(
      new CreateStudentRequested({ student: this.studentForm.value })
    );

    this.studentForm.reset();
  }

  ngOnDestroy() {
    // do not remove, needed for untilDestroy(this)
  }
}

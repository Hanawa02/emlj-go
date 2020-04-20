import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { of, Observable } from 'rxjs';
import { StudentsState } from 'src/app/store/students/students.reducer';
import { Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroy } from '@ngrx-utils/store';
import { tap } from 'rxjs/operators';
import { Aluno } from 'src/app/rest-api';
import { getSelectedStudent } from 'src/app/store/students/students.selectors';
import {
  CreateStudentRequested,
  UpdateStudentRequested,
  SelectStudent,
} from 'src/app/store/students/students.actions';
import { MatDatepicker } from '@angular/material/datepicker';
import { CPFFormatPipe } from 'src/app/shared/pipes/cpf-format.pipe';
import { CEPFormatPipe } from 'src/app/shared/pipes/cep-format.pipe';
import { PhoneFormatPipe } from 'src/app/shared/pipes/phone-format.pipe';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';

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
  activeStudent: boolean;

  isEdit: boolean;

  @ViewChild('dataNascimentoDatePicker')
  dataNascimentoDatePicker: MatDatepicker<Date>;

  constructor(
    private store: Store<StudentsState>,
    private formBuilder: FormBuilder,
    private cpfFormaterPipe: CPFFormatPipe,
    private cepFormaterPipe: CEPFormatPipe,
    private phoneFormatPipe: PhoneFormatPipe,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
      observacao: ['', []],
    });

    this.store
      .pipe(
        untilDestroy(this),
        select(getSelectedStudent),
        tap((student) => {
          this.student = student;
          if (student && student.id) {
            this.addStudentValuesToForm();
          }
        })
      )
      .subscribe();

    this.route.paramMap
      .pipe(
        untilDestroy(this),
        tap((params: ParamMap) => {
          const studentId = params.get('id');
          this.store.dispatch(new SelectStudent({ studentId }));
        })
      )
      .subscribe();

    this.studentForm.valueChanges
      .pipe(
        untilDestroy(this),
        tap(() => this.onFormValuesChanged())
      )
      .subscribe();
  }

  onFormValuesChanged(): void {
    this.studiedJapaneseBefore = this.studentForm.value.jaEstudouJapones;
    this.activeStudent =
      this.studentForm.value.situacaoDoCurso ===
      Aluno.SituacaoDoCursoEnum.Ativo;

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

  addStudentValuesToForm() {
    this.studentForm.patchValue({ ...this.student });
    this.formatAllFields();
  }

  formatAllFields() {
    this.formatCEP();
    this.formatCPF();
    this.formatCelular();
    this.formatTelefone();
  }
  openDataNascimentoDatePicker() {
    this.dataNascimentoDatePicker.open();
  }

  formatCPF(): void {
    this.studentForm.patchValue({
      CPF: this.cpfFormaterPipe.transform(this.studentForm.value.CPF, true),
    });
  }

  formatCEP(): void {
    this.studentForm.patchValue({
      CEP: this.cepFormaterPipe.transform(this.studentForm.value.CEP, true),
    });
  }

  formatTelefone(): void {
    this.studentForm.patchValue({
      telefone: this.phoneFormatPipe.transform(
        this.studentForm.value.telefone,
        true
      ),
    });
  }

  formatCelular(): void {
    this.studentForm.patchValue({
      celular: this.phoneFormatPipe.transform(
        this.studentForm.value.celular,
        true
      ),
    });
  }

  save() {
    const student = this.treatStudentFormValuesBeforeSave();

    if (this.student) {
      student.id = this.student.id;
      this.store.dispatch(new UpdateStudentRequested({ student }));
      this.router.navigate(['Alunos']);
      return;
    }
    this.store.dispatch(new CreateStudentRequested({ student }));

    this.studentForm.reset();
  }

  treatStudentFormValuesBeforeSave(): Aluno {
    const student = { ...this.studentForm.value };

    student.CPF = this.cpfFormaterPipe.removeCharacters(student.CPF);
    student.cep = this.cepFormaterPipe.removeCharacters(student.cep);
    student.celular = this.phoneFormatPipe.removeCharacters(student.celular);
    student.telefone = this.phoneFormatPipe.removeCharacters(student.telefone);

    return student;
  }
  ngOnDestroy() {
    // do not remove, needed for untilDestroy(this)
  }
}

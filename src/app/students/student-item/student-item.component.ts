import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { of, Observable } from 'rxjs';
import { StudentsState } from 'src/app/store/students/students.reducer';
import { Store, select } from '@ngrx/store';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { untilDestroy } from '@ngrx-utils/store';
import { tap } from 'rxjs/operators';
import { Aluno, FamiliarMatriculado, JLPT } from 'src/app/rest-api';
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
import { ListFormConfiguration } from 'src/app/shared/components/list-form/models/list-form-configuration.model';
import { ListFormColumn } from 'src/app/shared/components/list-form/models/list.form.column.model';
import { ParentescoEnum } from 'src/app/shared/constants/parentesco.enum';

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
  familyRelation = Object.values(ParentescoEnum);
  JLPTLevels = Object.values(JLPT.NivelEnum);

  addFamilyMemberName = new FormControl('');
  addFamilyMemberRelation = new FormControl('');

  addJLPTResultLevel = new FormControl('');
  addJLPTResultYear = new FormControl('');
  addJLPTResultScore = new FormControl('');

  studiedJapaneseBefore: boolean;
  activeStudent: boolean;

  isEdit: boolean;

  familyMembersConfiguration = new ListFormConfiguration([
    new ListFormColumn('nome', 'Nome', true),
    new ListFormColumn('parentesco', 'Parentesco', true),
  ]);

  JLPTTestsConfiguration = new ListFormConfiguration([
    new ListFormColumn('nivel', 'Nível', true),
    new ListFormColumn('ano', 'Ano', true),
    new ListFormColumn('pontuacao', 'Pontuação', true),
  ]);

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
      familiaresMatriculadosNaEscola: [[], []],
      JLPTResults: [[], []],
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
    this.studentForm.reset();
    this.addFamilyMemberName.reset();
    this.addFamilyMemberRelation.reset();

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

    for (const property of Object.keys(student)) {
      if (!student[property] && student[property] !== 0) {
        delete student[property];
      }
    }
    return student;
  }

  addFamilyMember() {
    const familyMembers: FamiliarMatriculado[] = this.studentForm.get(
      'familiaresMatriculadosNaEscola'
    ).value;
    const newMember = {
      nome: this.addFamilyMemberName.value,
      parentesco: this.addFamilyMemberRelation.value,
    };

    this.studentForm
      .get('familiaresMatriculadosNaEscola')
      .patchValue([...familyMembers, newMember]);

    this.addFamilyMemberName.reset();
    this.addFamilyMemberRelation.reset();
  }

  editFamilyMember(familyMember: FamiliarMatriculado) {
    this.addFamilyMemberName.patchValue(familyMember.nome);
    this.addFamilyMemberRelation.patchValue(familyMember.parentesco);

    this.deleteFamilyMember(familyMember);
  }

  deleteFamilyMember(familyMember: FamiliarMatriculado) {
    const familyMembers: FamiliarMatriculado[] = this.studentForm.get(
      'familiaresMatriculadosNaEscola'
    ).value;

    this.studentForm
      .get('familiaresMatriculadosNaEscola')
      .patchValue([...familyMembers.filter((item) => item !== familyMember)]);
  }

  addJLPTResult() {
    const JLPTResults: JLPT[] = this.studentForm.get('JLPTResults').value;
    const newResult = {
      nivel: this.addJLPTResultLevel.value,
      ano: this.addJLPTResultYear.value,
      pontuacao: this.addJLPTResultScore.value,
    };

    this.studentForm.get('JLPTResults').patchValue([...JLPTResults, newResult]);

    this.addJLPTResultLevel.reset();
    this.addJLPTResultYear.reset();
    this.addJLPTResultScore.reset();
  }

  editJLPTResult(JLPTResult: JLPT) {
    this.addJLPTResultLevel.patchValue(JLPTResult.nivel);
    this.addJLPTResultYear.patchValue(JLPTResult.ano);
    this.addJLPTResultScore.patchValue(JLPTResult.pontuacao);

    this.deleteJLPTResult(JLPTResult);
  }

  deleteJLPTResult(JLPTResult: JLPT) {
    const JLPTResults: JLPT[] = this.studentForm.get('JLPTResults').value;

    this.studentForm
      .get('JLPTResults')
      .patchValue([...JLPTResults.filter((item) => item !== JLPTResult)]);
  }

  ngOnDestroy() {
    // do not remove, needed for untilDestroy(this)
  }
}

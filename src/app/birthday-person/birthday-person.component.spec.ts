import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayPersonComponent } from './birthday-person.component';

describe('BirthdayPersonComponent', () => {
  let component: BirthdayPersonComponent;
  let fixture: ComponentFixture<BirthdayPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdayPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

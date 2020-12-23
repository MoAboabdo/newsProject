import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsCreateComponent } from './admins-create.component';

describe('AdminsCreateComponent', () => {
  let component: AdminsCreateComponent;
  let fixture: ComponentFixture<AdminsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelIngresoComponent } from './modelcreaedita-ingreso.component';

describe('TableActionComponent', () => {
  let component: ModelIngresoComponent;
  let fixture: ComponentFixture<ModelIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelIngresoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelEgresoComponent } from './modelcreaedita-egreso.component';

describe('TableActionComponent', () => {
  let component: ModelEgresoComponent;
  let fixture: ComponentFixture<ModelEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelEgresoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelProyectoComponent } from './modelcrear-proyecto.component';

describe('TableActionComponent', () => {
  let component: ModelProyectoComponent;
  let fixture: ComponentFixture<ModelProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelProyectoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

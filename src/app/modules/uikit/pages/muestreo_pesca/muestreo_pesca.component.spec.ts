import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MuestreoPescaComponent } from './muestreo_pesca.component';

describe('MuestreoComponent', () => {
  let component: MuestreoPescaComponent;
  let fixture: ComponentFixture<MuestreoPescaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MuestreoPescaComponent],
}).compileComponents();

    fixture = TestBed.createComponent(MuestreoPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

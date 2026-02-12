import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfPreviewDialogComponent } from './pdf-preview-dialog.component';

describe('TableContentComponent', () => {
  let component: PdfPreviewDialogComponent;
  let fixture: ComponentFixture<PdfPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPreviewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

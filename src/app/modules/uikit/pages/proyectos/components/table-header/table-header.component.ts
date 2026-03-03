import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr [app-table-header]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-header.component.html',
})
export class TableHeaderComponent {
  @Output() onCheck = new EventEmitter<boolean>();
  @Input() allSelected: boolean = false; 
  @Input() someSelected: boolean = false;

  onHeaderCheck(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.onCheck.emit(checked);
  }
}
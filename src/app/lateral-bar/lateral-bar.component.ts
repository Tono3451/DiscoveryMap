import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent {
  @Output() filterClick = new EventEmitter<void>();
  @Output() userClick = new EventEmitter<void>();

  onFilterClick() {
    this.filterClick.emit();
  }

  onUserClick() {
    this.userClick.emit();
  }
}

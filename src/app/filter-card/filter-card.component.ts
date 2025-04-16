import { Component, EventEmitter, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-filter-card',
  templateUrl: './filter-card.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./filter-card.component.css']
})
export class FilterCardComponent {
  filters = {
    location: '',
    category: '',
    privacy: '',
    date: ''
  };

  @Output() filtersApplied = new EventEmitter<any>();

  applyFilters() {
    this.filtersApplied.emit(this.filters);
  }

  resetFilters() {
    this.filters = {
      location: '',
      category: '',
      privacy: '',
      date: ''
    };
    this.filtersApplied.emit(this.filters);
  }
}

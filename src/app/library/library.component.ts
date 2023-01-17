import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../state/books.repository';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent {
  @Input() books: Array<Book>;
  @Output() remove = new EventEmitter();
}

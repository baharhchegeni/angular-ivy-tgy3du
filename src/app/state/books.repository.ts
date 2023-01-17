import { Injectable } from '@angular/core';
import { createState, propsArrayFactory, Store } from '@ngneat/elf';
import {
  selectEntities,
  setEntities,
  selectAll,
  withEntities,
} from '@ngneat/elf-entities';
import { map, withLatestFrom } from 'rxjs/operators';

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: Array<string>;
  };
}

const {
  withLibraryIds,
  selectLibraryIds,
  addLibraryIds,
  removeLibraryIds,
  inLibraryIds,
} = propsArrayFactory('libraryIds', { initialValue: [] as string[] });

const { state, config } = createState(withEntities<Book>(), withLibraryIds());

const store = new Store({ name: 'books', state, config });

@Injectable({ providedIn: 'root' })
export class BooksRepository {
  books$ = store.pipe(selectAll());

  ownBooks$ = store.pipe(selectLibraryIds()).pipe(
    withLatestFrom(store.pipe(selectEntities())),
    map(([ids, books]) => ids.map((id) => books[id]))
  );

  setBooks(books: Book[]) {
    store.update(setEntities(books));
  }

  removeFromLibrary(bookId: string) {
    store.update(removeLibraryIds(bookId));
  }

  addToLibrary(bookId: string) {
    if (!store.query(inLibraryIds(bookId))) {
      store.update(addLibraryIds(bookId));
    }
  }
}

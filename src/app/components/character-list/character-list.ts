import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Character } from '../../models/character';
import { catchError, EMPTY, finalize } from 'rxjs';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss'],
})
export class CharacterListComponent implements OnInit {
  private api = inject(Api);

  public characters = this.api.characters;

  public searchTerm: string = '';
  public loading = signal<boolean>(false);
  public errorMessage = signal<string>('');

  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .getCharacters()
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(() => {
          this.errorMessage.set('Error al cargar personajes.');
          return EMPTY;
        })
      )
      .subscribe();
  }

  onSearch(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api
      .searchCharacters(this.searchTerm)
      .pipe(
        finalize(() => this.loading.set(false)),
        catchError(() => {
          this.errorMessage.set(
            'No se pudieron encontrar personajes con ese término de búsqueda.'
          );
          return EMPTY;
        })
      )
      .subscribe();
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}

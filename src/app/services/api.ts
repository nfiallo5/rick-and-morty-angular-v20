import { Injectable, Signal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, Character } from '../models/character';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly API_URL: string =
    'https://rickandmortyapi.com/api/character';
  private readonly http = inject(HttpClient);

  private charactersSignal = signal<Character[]>([]); // Define esto como una señal<Character[]>
  public readonly characters = this.charactersSignal.asReadonly();
  // Define esto como una señal de solo lectura

  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap((response: ApiResponse) => {
        this.charactersSignal.set(response.results);
      })
    );
  }

  searchCharacters(name: string): Observable<ApiResponse> {
    if (!name || !name.trim()) {
      return this.getCharacters();
    }

    const searchUrl = `${this.API_URL}?name=${name}`;
    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap((response: ApiResponse) => {
        this.charactersSignal.set(response.results);
      })
    );
  }
}

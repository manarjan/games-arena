import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/gamesarena.model';
import { environment } from 'src/environments/environment';
import { map, shareReplay, catchError } from 'rxjs/operators';

@Injectable()
export class GameService {
  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(environment.api.games).pipe(
      shareReplay(),
      map((games) => {
        return games.slice(1);
      }),
      catchError((err) => {
        return this.http.get<Game[]>('assets/games.json').pipe(shareReplay());
      })
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Game } from 'src/app/models/gamesarena.model';
import { Sorting, SortingDirection } from 'src/app/models/sorting.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(private gameService: GameService) {}

  SortingDirection = SortingDirection;

  fiterForm: FormGroup = new FormGroup({
    title: new FormControl(null),
    platform: new FormControl(null),
    genre: new FormControl(null),
  });

  searchByTitle$: Subject<string> = new Subject<string>();

  sorted$: Subject<Sorting> = new Subject();

  games$: Observable<Game[]> = this.gameService.getGames();

  autoCompleteFiltered$: Observable<Game[]> = this.games$.pipe(
    switchMap((games: Game[]) => {
      return this.fiterForm.controls.title.valueChanges.pipe(
        startWith(''),
        map((filter: string) => {
          return filter
            ? games.filter((game) =>
                game.title.toLowerCase().includes(filter.toLowerCase())
              )
            : games;
        })
      );
    })
  );

  searched$: Observable<Game[]> = this.games$.pipe(
    switchMap((games: Game[]) => {
      return combineLatest(
        this.searchByTitle$.pipe(startWith(null)),
        this.fiterForm.controls.platform.valueChanges.pipe(startWith(null)),
        this.fiterForm.controls.genre.valueChanges.pipe(startWith(null))
      ).pipe(
        map(([title, platform, genre]: [string, string, string]) => {
          if (!(title || platform || genre)) {
            return games;
          }
          return games.filter(
            (game) =>
              (title &&
                game.title.toLowerCase().includes(title.toLowerCase())) ||
              (genre &&
                game.genre.toLowerCase().includes(genre.toLowerCase())) ||
              (platform &&
                game.platform.toLowerCase().includes(platform.toLowerCase()))
          );
        }),
        switchMap((games) => {
          return this.sorted$.pipe(
            startWith(null),
            map((sorting) => {
              if (!sorting) {
                return games;
              } else {
                return [...games].sort((game1, game2) => {
                  return sorting.direction === SortingDirection.ASC
                    ? typeof game1[sorting.field] === 'string'
                      ? game1[sorting.field].localeCompare(game2[sorting.field])
                      : game1[sorting.field] - game2[sorting.field]
                    : typeof game1[sorting.field] === 'string'
                    ? game2[sorting.field].localeCompare(game1[sorting.field])
                    : game2[sorting.field] - game1[sorting.field];
                });
              }
            })
          );
        })
      );
    })
  );

  ngOnInit(): void {}

  onReset() {
    this.fiterForm.reset();
    this.searchByTitle$.next('');
    this.sorted$.next(null);
  }

  onSort(field: string, direction: SortingDirection) {
    this.sorted$.next({ field, direction });
  }

  filterByTitle() {
    this.searchByTitle$.next(this.fiterForm.controls.title.value);
  }

  filterByPlatform(platform: string) {
    this.fiterForm.reset();
    this.fiterForm.patchValue({ platform });
  }

  filterByGenre(genre: string) {
    this.fiterForm.reset();
    this.fiterForm.patchValue({ genre });
  }
}

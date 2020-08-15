import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Game } from 'src/app/models/gamesarena.model';
import { PlatformIconMapping } from 'src/app/constants/icons.constant';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, OnChanges {
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.game && changes.game.currentValue) {
      if (!this.game.genre) {
        this.game.genre = 'Generic';
      }
    }
  }
  PlatformIconMapping = PlatformIconMapping;
  @Input() game: Game;

  @Output() platformSelected = new EventEmitter<string>();
  @Output() genreSelected = new EventEmitter<string>();

  ngOnInit(): void {}

  onPlatformSelect(platform: string) {
    this.platformSelected.emit(platform);
  }
  onGenreSelect(genre: string) {
    this.genreSelected.emit(genre);
  }
}

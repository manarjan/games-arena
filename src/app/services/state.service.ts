import { Injectable } from '@angular/core';

@Injectable()
export class StateService {
  constructor() {}

  private _isLoading: boolean;

  set isLoading(loading: boolean) {
    Promise.resolve(null).then(() => {
      this._isLoading = loading;
    });
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  private stockAddedToWatchlist = new Subject<void>();

  stockAddedToWatchlist$ = this.stockAddedToWatchlist.asObservable();

  addStockToWatchlist(): void {
    this.stockAddedToWatchlist.next();
  }
}
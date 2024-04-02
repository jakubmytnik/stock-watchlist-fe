import { Component, OnInit } from '@angular/core';
import { Observable, of, debounceTime, switchMap, Subject } from 'rxjs';
import { SearchResult } from '../data/search.result';
import { SearchHttpService } from '../services/seach.http.service';
import { StocksService } from '../services/stocks.service';
import { WatchlistHttpService } from '../services/watchlist.http.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  searchResults: SearchResult[] = [];
  searchQuery: string = '';
  loading: boolean = false;

  searchQuery$: Subject<Event> = new Subject<Event>();

  constructor(private searchHttpService: SearchHttpService, private stocksService: StocksService, private watchlistHttpService: WatchlistHttpService) { }

  ngOnInit(): void {
    this.searchQuery$.pipe(
      debounceTime(1000)
    ).subscribe(query => {
      this.loading = true;
      this.searchStocks((query.target as HTMLInputElement).value).subscribe(results => {
        this.searchResults = results;
        this.loading = false;
      });
    });
  }

  searchStocks(query: string): Observable<SearchResult[]> {
    if (query === '') {
      return of([]);
    }
    return this.searchHttpService.searchByName(query);
  }


  addToWatchlist(stock: SearchResult): void {
    this.watchlistHttpService.addToWatchlist(stock.symbol, stock.companyName).subscribe({
      next: () => {
        this.clearSearchQuery();
        this.stocksService.addStockToWatchlist();
      },
      error: (e) => console.error("Error on add stock to watchlist", e)
    }

    );
  }

  clearSearchQuery() {
    this.searchQuery = '';
    this.searchResults.splice(0);
  }
}

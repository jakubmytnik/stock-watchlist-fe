import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { StocksService } from '../services/stocks.service';
import { interval, Subscription } from 'rxjs';
import { Stock } from '../data/stock';
import { environment } from 'src/env/environment';
import { WatchlistHttpService } from '../services/watchlist.http.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit, AfterViewInit {

  stockAddedSubscription!: Subscription;

  displayedColumns: string[] = ['symbol', 'price', 'priceChange', 'dividendYield', 'dividendGrowthYears',
    'divGrowth5y', 'divGrowth3y', 'fcfPayoutRatio', 'actions'];
  dataSource: MatTableDataSource<Stock>;
  @ViewChild(MatSort) sort!: MatSort;

  loading: boolean = false;


  constructor(private stocksService: StocksService, private watchlistHttpService: WatchlistHttpService) {
    this.dataSource = new MatTableDataSource<Stock>([]);
  }

  ngOnInit(): void {
    this.fetchStocks();
    this.stockAddedSubscription = this.stocksService.stockAddedToWatchlist$.subscribe(
      () => this.fetchStocks()
    );
    interval(environment.refreshInterval).subscribe(() => this.fetchStocks());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  fetchStocks(): void {
    this.loading = true;

    this.watchlistHttpService.getWatchlist().subscribe({
      next: (data: Stock[]) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        console.error('Error fetching stocks:', e);
      }
    }
    );

  }

  removeFromWatchlist(symbol: String) {
    this.watchlistHttpService.deleteFromWatchlist(symbol).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(stock => stock.symbol !== symbol);
      },
      error: (e) => {
        console.error('Error removing stock:', e);
      }
    });


  }

  ngOnDestroy(): void {
    this.stockAddedSubscription.unsubscribe();
  }
}

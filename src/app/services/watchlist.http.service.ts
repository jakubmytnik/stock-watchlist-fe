import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/env/environment";
import { Stock } from "../data/stock";

@Injectable({
    providedIn: 'root',
  })
  export class WatchlistHttpService {

    constructor(private http: HttpClient) {}

    getWatchlist(): Observable<Stock[]>{
        return this.http.get<Stock[]>(`${environment.backendUrl}/watchlist`);
    }

    addToWatchlist(symbol : String, companyName : String):Observable<any>{
        return this.http.post(`${environment.backendUrl}/watchlist/${symbol}`, {companyName: companyName});
    }

    deleteFromWatchlist(symbol : String): Observable<any> {
        return this.http.delete(`${environment.backendUrl}/watchlist/${symbol}`);
    }
    
  }
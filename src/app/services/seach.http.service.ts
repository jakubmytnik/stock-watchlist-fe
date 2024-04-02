import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/env/environment";

@Injectable({
    providedIn: 'root',
})
export class SearchHttpService {

    constructor(private http: HttpClient) { }

    searchByName(query: String): Observable<any[]> {
        return this.http.get<any[]>(`${environment.backendUrl}/symbols/search/${query}`);
    }

}
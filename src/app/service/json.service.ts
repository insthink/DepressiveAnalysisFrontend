import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  private BASE_PATH = 'assets/json';

  constructor(private http: HttpClient) { }

  loadPreprocessed(currentId: number):Observable<any> {
    let id = currentId.toString();
    const l = id.length;
    // 补0
    if (l == 1) {
      id = `00${currentId}`;
    } else if  (l == 2) {
      id = `0${currentId}`;
    }
    // path
    const path = `${this.BASE_PATH}/Preprocessed/Proc${id}.json`;
    return this.http.get(path)
      .pipe(
        map(data => data)
      )
  }

  loadScatter():Observable<any> {
    // path
    const path = `${this.BASE_PATH}/Time_Features_108.json`;
    return this.http.get(path)
      .pipe(
        map(data => data)
      )
  }

  loadTable():Observable<any> {
    // path
    const path = `${this.BASE_PATH}/All_Features_108.json`;
    return this.http.get(path)
      .pipe(
        map(data => data)
      )
  }

  loadAnalysis():Observable<any> {
    // path
    const path = `${this.BASE_PATH}/Analysis.json`;
    return this.http.get(path)
      .pipe(
        map(data => data)
      )
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../../environments/environment";
import {Sport} from "./sports.model";

const BACKEND_URL = environment.apiUrl + "/world/";

@Injectable({
  providedIn: 'root'
})
export class SportsService {
  private sports:Sport[] = [];
  private sportsUpdated = new Subject<{ sports: Sport[], sportCount:number }>();

  constructor(private http:HttpClient, private router: Router) { }


  getSports(sportsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${sportsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; sports: any; maxSports: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(sportData => {
          return {
            sports: sportData.sports.map(sport => {
              return {
                title: sport.title,
                content: sport.content,
                id: sport._id,
                imagePath: sport.imagePath,
                creator: sport.creator
                
              };
            }),
            maxSports: sportData.maxSports
          };
        })
      )
      .subscribe(transformedSportData => {
        this.sports = transformedSportData.sports;
        this.sportsUpdated.next({
          sports: [...this.sports],
          sportCount: transformedSportData.maxSports
        });
      });
  }

  getSportUpdateListener() {
    return this.sportsUpdated.asObservable();
  }

  getSport(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      article:string,
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addSport(title: string, description: string, article:string , image: File) {
    const sportData = new FormData();
    sportData.append("title", title);
    sportData.append("description", description);
    sportData.append("article", article);

    sportData.append("image", image, title);
    this.http
      .post<{ message: string; sport: Sport }>(
        BACKEND_URL + "add",
        sportData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateSport(id: string, title: string, description: string,article:string, image: File | string) {
    let sportData: Sport | FormData;
    if (typeof image === "object") {
      sportData = new FormData();
      sportData.append("id", id);
      sportData.append("title", title);
      sportData.append("description", description);
      sportData.append("article", article);
      sportData.append("image", image, title);
    } else {
      sportData = {
        id: id,
        title: title,
        description: description,
        article: article,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, sportData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteSport(sportId: string) {
    return this.http.delete(BACKEND_URL + sportId);
  }


}

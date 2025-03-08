import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@enviroments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import type { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const loadFroamLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem('searchHistory') ?? '{}';
  const gifsData = JSON.parse(gifsFromLocalStorage);

  return gifsData;
}

// {
//   'Goku': [gif1,gif2,gif3],
//   'Gohan': [gif1,gif2,gif3],
//   'Spiderman': [gif1,gif2,gif3]
// }

// Record<string, Gif[]>

@Injectable({providedIn: 'root'})
export class GifService {
  // Este objeto nos permite acceder a la instancia de HttpClient como: get, post, put, delete, etc.
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFroamLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  //cuando mande llamar al servicio GifService se ejecutara la funcion loadTrendingGifs
  constructor() {
    this.loadTrendingGifs();
  }

  saveToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem('searchHistory', historyString);
  })

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 10
      }
    }).subscribe( (resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
    })
  }

  //crear metodo llamado searchGif y reciba el query
  searchGif(query:string) : Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${ environment.giphyApiUrl }/gifs/search`, {
      params:{
        api_key: environment.giphyApiKey,
        q:query,
        limit:10
      }
    }).pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      //Historial
      tap( (gifs) => {
        this.searchHistory.update((history) => ({
          ...history, [query.toLowerCase()]:gifs}))
      })
    )
  }

  getHistoryGifs( query: string ) : Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}

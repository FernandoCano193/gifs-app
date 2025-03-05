import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.services';
import type { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {

  gifsService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch( query:string ) {
    this.gifsService.searchGif(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.services';
import type { Gif } from '../../interfaces/gif.interface';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent {
  //injectamos el servicio
  gifsService = inject(GifService);


  //recuperamos el query desde la url

  // query = inject(ActivatedRoute).params.subscribe((params) => {
  //   console.log(params['query']);
  // })

  //toSignal transaforma los observable en signal

  //modo simplificado

  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( (params) => params['query'] )
    )
  )

  gifsByKey = computed(() => this.gifsService.getHistoryGifs(this.query()));
}

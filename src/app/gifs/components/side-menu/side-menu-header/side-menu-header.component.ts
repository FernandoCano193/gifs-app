import { Component } from '@angular/core';
import { environment } from '@enviroments/environment';
@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
})
export class SideMenuHeaderComponent {
  envs = environment;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  imports: [],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input() icon: string = '';
}

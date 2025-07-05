import { Component, Input, NgModule } from '@angular/core';
import { IconButtonComponent } from '../../atoms/icon-buttom/icon-button.component';
import { NgClass, NgComponentOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  imports: [IconButtonComponent,NgIf],
  standalone: true
})
export class NavItemComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() expanded: boolean = false;
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Othello';
  row = '<tr><td>another table</td></tr>';
  celltext = 'cell contents';
}

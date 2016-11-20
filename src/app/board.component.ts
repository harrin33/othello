import { Component } from '@angular/core';
import { Cell } from './cell';
import { BoardState } from './board-state';
import { GameController } from './game-controller';


@Component({
    selector:'game-board',
    template:`
     <table elem-ready="setUpDisks()">
            <thead>
            <tr class="coord">
              <th class="coord">&nbsp;</th>
              <th class="coord">a</th>
                <th class="coord">b</th>
                <th class="coord">c</th>
                <th class="coord">d</th>
                <th class="coord">e</th>
                <th class="coord">f</th>
                <th class="coord">g</th>
                <th class="coord">h</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td *ngFor="let cell of row1"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row2"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row3"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row4"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row5"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row6"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row7"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            <tr>
                <td *ngFor="let cell of row8"
                [class.selected]="cell === selectedCell"
                (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}>
                </td>
            </tr>
            </tbody>
        </table>
        
    `
    
})

export class BoardComponent {
    row1: Cell[] = [    {row:1, column:'', diskType:''},
                        {row:1, column:'a', diskType:''},
                        {row:1, column:'b', diskType:''},
                        {row:1, column:'c', diskType:''},
                        {row:1, column:'d', diskType:''},
                        {row:1, column:'e', diskType:''},
                        {row:1, column:'f', diskType:''},
                        {row:1, column:'g', diskType:''},
                        {row:1, column:'h', diskType:''}
                        ];
    row2: Cell[] = [    {row:2, column:'', diskType:''},
                        {row:2, column:'a', diskType:''},
                        {row:2, column:'b', diskType:''},
                        {row:2, column:'c', diskType:''},
                        {row:2, column:'d', diskType:''},
                        {row:2, column:'e', diskType:''},
                        {row:2, column:'f', diskType:''},
                        {row:2, column:'g', diskType:''},
                        {row:2, column:'h', diskType:''}
                        ];                        
    row3: Cell[] = [    {row:3, column:'', diskType:''},
                        {row:3, column:'a', diskType:''},
                        {row:3, column:'b', diskType:''},
                        {row:3, column:'c', diskType:''},
                        {row:3, column:'d', diskType:''},
                        {row:3, column:'e', diskType:''},
                        {row:3, column:'f', diskType:''},
                        {row:3, column:'g', diskType:''},
                        {row:3, column:'h', diskType:''}
                        ];
    row4: Cell[] = [    {row:4, column:'', diskType:''},
                        {row:4, column:'a', diskType:''},
                        {row:4, column:'b', diskType:''},
                        {row:4, column:'c', diskType:''},
                        {row:4, column:'d', diskType:''},
                        {row:4, column:'e', diskType:''},
                        {row:4, column:'f', diskType:''},
                        {row:4, column:'g', diskType:''},
                        {row:4, column:'h', diskType:''}
                        ];
    row5: Cell[] = [    {row:5, column:'', diskType:''},
                        {row:5, column:'a', diskType:''},
                        {row:5, column:'b', diskType:''},
                        {row:5, column:'c', diskType:''},
                        {row:5, column:'d', diskType:''},
                        {row:5, column:'e', diskType:''},
                        {row:5, column:'f', diskType:''},
                        {row:5, column:'g', diskType:''},
                        {row:5, column:'h', diskType:''}
                        ];
    row6: Cell[] = [    {row:6, column:'', diskType:''},
                        {row:6, column:'a', diskType:''},
                        {row:6, column:'b', diskType:''},
                        {row:6, column:'c', diskType:''},
                        {row:6, column:'d', diskType:''},
                        {row:6, column:'e', diskType:''},
                        {row:6, column:'f', diskType:''},
                        {row:6, column:'g', diskType:''},
                        {row:6, column:'h', diskType:''}
                        ];
    row7: Cell[] = [    {row:7, column:'', diskType:''},
                        {row:7, column:'a', diskType:''},
                        {row:7, column:'b', diskType:''},
                        {row:7, column:'c', diskType:''},
                        {row:7, column:'d', diskType:''},
                        {row:7, column:'e', diskType:''},
                        {row:7, column:'f', diskType:''},
                        {row:7, column:'g', diskType:''},
                        {row:7, column:'h', diskType:''}
                        ];
    row8: Cell[] = [    {row:8, column:'', diskType:''},
                        {row:8, column:'a', diskType:''},
                        {row:8, column:'b', diskType:''},
                        {row:8, column:'c', diskType:''},
                        {row:8, column:'d', diskType:''},
                        {row:8, column:'e', diskType:''},
                        {row:8, column:'f', diskType:''},
                        {row:8, column:'g', diskType:''},
                        {row:8, column:'h', diskType:''}
                        ];
    selectedCell: Cell;
    currentPlayer: string;
    
    onSelect(cell: Cell): void {
        this.selectedCell = cell;
        if(this.currentPlayer == "ie"){
            this.addIeDisk(cell);
        } else {
            this.addChromeDisk(cell);
        }
    }
    
    addIeDisk(cell: Cell): void{
        var tableCell = document.getElementById(cell.row + cell.column)
        var disk = document.createElement('i');
        disk.setAttribute('class','fa fa-internet-explorer fa-2x');
        tableCell.appendChild(disk);
        cell.diskType='ie';
        this.currentPlayer = 'chrome';
    }
    
    addChromeDisk(cell: Cell): void{
        var tableCell = document.getElementById(cell.row + cell.column)
        var disk = document.createElement('i');
        disk.setAttribute('class','fa fa-chrome fa-2x');
        tableCell.appendChild(disk);
        cell.diskType='chrome';
        this.currentPlayer = 'ie';
    }
    
    setUpDisks(): void {
    /* todo - this doesn't work */
        var cell1 = document.getElementById('4d');
        var disk = document.createElement('i');
        disk.setAttribute('class','fa fa-chrome fa-2x');
        cell1.appendChild(disk);
        
    }
}
import { Component } from '@angular/core';
import { Cell } from './cell';
import { Row } from './row';
import { Board } from './board';
import {AfterViewInit} from '@angular/core'; 

@Component({
    selector:'game-board',
    template:`
    
        <div>&nbsp;</div>
              
        <table>
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>a</th>
                    <th>b</th>
                    <th>c</th>
                    <th>d</th>
                    <th>e</th>
                    <th>f</th>
                    <th>g</th>
                    <th>h</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let row of board.rows">
                    <td class="coord">{{row.no + 1}}</td>
                    <td *ngFor="let cell of row.cells"
                    [class.selected]="cell === selectedCell"
                    (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}></td>
                </tr>
            </tbody>
        </table>
        
                
    `
    
})

export class BoardComponent implements AfterViewInit{

    board: Board = {rows: this.buildBoard()}
                        
    buildBoard(): Row[] {
        let rowArray = [];
        for (var i=0; i<8; i++){
            rowArray.push(this.buildRow(i));
        }
        return rowArray;
    }
    
    buildCells(rowno: number): Cell[] {
        let cellArray = [];
        for (var i = 0; i< 8; i++) { 
            cellArray.push({row:rowno, column:i, diskType:''});
        }
        return cellArray;
    }

    buildRow(rowno: number): Row {
        let row: Row = {no: rowno, cells: this.buildCells(rowno)};
        return row;
    }
    
    
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
        var tableCell = document.getElementById('' + cell.row + cell.column)
        if (! tableCell.firstChild) {
            var disk = document.createElement('i');
            disk.setAttribute('class','fa fa-internet-explorer fa-2x');
            tableCell.appendChild(disk);
            cell.diskType='ie';
            this.currentPlayer = 'chrome';
        }
    }
    
    addChromeDisk(cell: Cell): void{
        var tableCell = document.getElementById('' + cell.row + cell.column)
        if (! tableCell.firstChild) {
            var disk = document.createElement('i');
            disk.setAttribute('class','fa fa-chrome fa-2x');
            tableCell.appendChild(disk);
            cell.diskType='chrome';
            this.currentPlayer = 'ie';
        }
    }
    
    setUpDisks(): void {
        
        var cell = document.getElementById('33');
        if(!cell.firstChild){
            var disk = document.createElement('i');
            disk.setAttribute('class','fa fa-chrome fa-2x');
            cell.appendChild(disk);
        }
        cell =  document.getElementById('44');
        if(!cell.firstChild){
            var disk = document.createElement('i');
            disk.setAttribute('class','fa fa-chrome fa-2x');
            cell.appendChild(disk);
        }
        cell =  document.getElementById('34');
        if(!cell.firstChild){
            var disk = document.createElement('i');
            disk.setAttribute('class','fa fa-internet-explorer fa-2x');
            cell.appendChild(disk);
        }
        cell =  document.getElementById('43');
        if(!cell.firstChild){
            var disk = document.createElement('i');
            disk.setAttribute('class','fa fa-internet-explorer fa-2x');
            cell.appendChild(disk);
        }
        
        /* todo - update the board with details of the counters added */
    }
    
    ngAfterViewInit(){
        this.setUpDisks();
    }
}
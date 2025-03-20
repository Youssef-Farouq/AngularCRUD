import { ExpenseService } from './../Services/expense.service';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Expense } from '../Models/expense.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expense-grid',
  imports: [MatTableModule, MatPaginatorModule, MatSnackBarModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './expense-grid.component.html',
  styleUrl: './expense-grid.component.css'
})

export class ExpenseGridComponent {
  ExpenseService = inject(ExpenseService);
  snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ["id", "title", "category", "amount", "date", "actions"]

  dataSource = new MatTableDataSource<Expense>();

  totalItems: number = 0;
  pageSize : number = 10; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  expenses = this.ExpenseService.expenses;

  constructor(){
    this.ExpenseService.getExpenses();

    effect(() => {
      const expenses = this.expenses();
      this.dataSource.data = expenses;
      this.totalItems = expenses.length;
    })
  }

  onPageChange(event: any){
    this.pageSize = event.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  deleteExpense(expenseId: number){
    this.ExpenseService.deleteExpense(expenseId);
    this.snackBar.open("Expense Deleted Successfully")
  }

}

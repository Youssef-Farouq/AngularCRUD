import { Injectable, signal } from '@angular/core';
import { Expense } from '../Models/expense.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expenseSignal = signal<Expense[]>([]);

  constructor(private http: HttpClient) {}

  //GEt all Expenses
  getExpenses(){
    this.http.get<Expense[]>('http://localhost:3000/expenses')
    .subscribe(expenses => this.expenseSignal.set(expenses));
  }

  get expenses(){
  return this.expenseSignal;
  }

  //Add Expenses
  addExpense(expense: Expense){
    this.http.post('http://localhost:3000/expenses', expense)
    .subscribe(() => this.getExpenses())
  }

  //Delete an Expense
  deleteExpense(id:  number){
    this.http.delete(`http://localhost:3000/expenses/${id}`)
    .subscribe(() => this.getExpenses())
  }

  //Update an Expense
  updateExpense(id:  string, updatedExpenses: Expense){
    this.http.put(`http://localhost:3000/expenses/${id}`, updatedExpenses)
    .subscribe(() => this.getExpenses())
  }

  //Get Expense by Id
  GetExpenseById(id: number){
    return this.expenseSignal().find(expense => expense.id == id);
  }
}

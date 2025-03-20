import { ExpenseService } from './../Services/expense.service';
import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Expense } from '../Models/expense.model';

@Component({
  selector: 'app-expense-add-edit',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatCardModule, MatIconModule, MatFormFieldModule],
  templateUrl: './expense-add-edit.component.html',
  styleUrl: './expense-add-edit.component.css'
})
export class ExpenseAddEditComponent {

  ExpenseService = inject (ExpenseService);
  router = inject (Router)
  snackBar = inject (MatSnackBar)
  route = inject (ActivatedRoute)

  categories = ["Food", "Travel", "Entertainment" , "Luxury" , "Movies", "Gaming"]

  expenseForm: FormGroup;

  isEditMode = false;

  expenseId: number = 0 

  constructor(private fb: FormBuilder){

    this.expenseForm = this.fb.group({
      title: ["", Validators.required],
      category: ["", Validators.required],
      amount: ["", Validators.required],
      date: ["", Validators.required]
    })

    this.route.paramMap.subscribe(params => {
      const id = params.get("id");

      if(id){
        this.isEditMode = true;
        this.expenseId = +id;
        this.ExpenseService.getExpenses();

        effect(() => {
          const expense = this.ExpenseService.expenses();
          if(expense.length > 0){
            this.loadExpenseData(this.expenseId);
          }
        })
      }
    });


  }

loadExpenseData(expenseId: number){
  const expense = this.ExpenseService.GetExpenseById(expenseId);
  console.log(expense);
  if(expense){
    this.expenseForm.patchValue({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date
    })
  }
}

onSubmit(){
  console.log("Form Submitted");
  console.log(this.expenseForm)
  if(this.expenseForm.valid){
    const expense: Expense = {...this.expenseForm.value, id:this.expenseId  || Date.now()}
  
    if(this.isEditMode && this.expenseId !== null){
      // Edit and existing expense
      this.ExpenseService.updateExpense(this.expenseId.toString(), expense);
      this.snackBar.open("Expense Edited Successfullt")
    }

    else{
      // Add new expense
      this.ExpenseService.addExpense(expense)
      this.snackBar.open("Expense Added Successfully")
    }

    this.router.navigate(["dashboard"])
  }
}

}

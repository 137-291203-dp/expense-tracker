// Expense Tracker Web Application

// Expense data structure
class Expense {
  constructor(amount, category, date) {
    this.amount = amount;
    this.category = category;
    this.date = date;
  }
}

// Global variables
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
const expenseForm = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const totalExpensesDisplay = document.getElementById('total-expenses');
const expensesList = document.getElementById('expenses-list');
const chartCanvas = document.getElementById('expenses-chart').getContext('2d');

// Add expense event listener
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;
  
  if (!amount || !category || !date) {
    alert('Please fill in all fields');
    return;
  }
  
  const newExpense = new Expense(amount, category, date);
  expenses.push(newExpense);
  updateExpenses();
  updateChart();
  saveExpenses();
  expenseForm.reset();
});

// Update total expenses display
function updateExpenses() {
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  totalExpensesDisplay.textContent = `$${totalExpenses.toFixed(2)}`;
}

// Update expenses list
function updateExpensesList() {
  expensesList.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.textContent = `Amount: $${expense.amount.toFixed(2)} | Category: ${expense.category} | Date: ${expense.date}`;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      expenses.splice(index, 1);
      updateExpenses();
      updateChart();
      saveExpenses();
    });
    
    li.appendChild(deleteButton);
    expensesList.appendChild(li);
  });
}

// Update chart using Chart.js
function updateChart() {
  const categories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const chartData = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(categories),
      backgroundColor: Object.keys(categories).map((_, index) => `rgba(54, 162, 235, 0.2)`),
      borderColor: Object.keys(categories).map((_, index) => `rgba(54, 162, 235, 1)`),
      borderWidth: 1
    }]
  };
  
  new Chart(chartCanvas, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Initial setup
updateExpenses();
updateExpensesList();
updateChart();
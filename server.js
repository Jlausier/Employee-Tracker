// require all neccessary files
const connection = require('./config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const validate = require('./javascript/validate');
// Database Connect and Starter Title
connection.connect((error) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('Employee Tracker')));
    console.log(``);
    console.log(`                                                          ` + chalk.greenBright.bold('Created By: Jacob Lausier'));
    console.log(``);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
  const promptUser = () => {
    inquirer.prompt([
        {
          name: 'choices',
          type: 'list',
          message: 'Please select an option:',
          choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'View All Employees By Department',
            'View Department Budgets',
            'Update Employee Role',
            'Update Employee Manager',
            'Add Employee',
            'Add Role',
            'Add Department',
            'Remove Employee',
            'Remove Role',
            'Remove Department',
            'Exit'
            ]
        }
      ])
      // answers to the prompt
      .then((answers) => {
        const {choices} = answers;
  
          if (choices === 'View All Employees') {
              viewAllEmployees();
          }
  
          if (choices === 'View All Departments') {
            viewAllDepartments();
        }
  
          if (choices === 'View All Employees By Department') {
              viewEmployeesByDepartment();
          }
  
          if (choices === 'Add Employee') {
              addEmployee();
          }
  
          if (choices === 'Remove Employee') {
              removeEmployee();
          }
  
          if (choices === 'Update Employee Role') {
              updateEmployeeRole();
          }
  
          if (choices === 'Update Employee Manager') {
              updateEmployeeManager();
          }
  
          if (choices === 'View All Roles') {
              viewAllRoles();
          }
  
          if (choices === 'Add Role') {
              addRole();
          }
  
          if (choices === 'Remove Role') {
              removeRole();
          }
  
          if (choices === 'Add Department') {
              addDepartment();
          }
  
          if (choices === 'View Department Budgets') {
              viewDepartmentBudget();
          }
  
          if (choices === 'Remove Department') {
              removeDepartment();
          }
  
          if (choices === 'Exit') {
              connection.end();
          }
    });
  };
  // View All Employees
const viewAllEmployees = () => {
    let sql =       `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.department_name AS 'department', 
                    role.salary
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.log(`                              ` + chalk.green.bold(`Current Employees:`));
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.table(response);
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
    });
  };
  // View all Roles
const viewAllRoles = () => {
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    const sql =     `SELECT role.id, role.title, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
        response.forEach((role) => {console.log(role.title);});
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
  };
  // View all Departments
const viewAllDepartments = () => {
    const sql =   `SELECT department.id AS id, department.department_name AS department FROM department`; 
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.log(`                              ` + chalk.green.bold(`All Departments:`));
      console.log(chalk.yellow.bold(`====================================================================================`));
      console.table(response);
      console.log(chalk.yellow.bold(`====================================================================================`));
      promptUser();
    });
  };
  // View all Employees by Department
const viewEmployeesByDepartment = () => {
    const sql =     `SELECT employee.first_name, 
                    employee.last_name, 
                    department.department_name AS department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
        console.log(chalk.yellow.bold(`====================================================================================`));
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
      });
  };
  //View all Departments by Budget
const viewDepartmentBudget = () => {
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    const sql =     `SELECT department_id AS id, 
                    department.department_name AS department,
                    SUM(salary) AS budget
                    FROM  role  
                    INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
        console.table(response);
        console.log(chalk.yellow.bold(`====================================================================================`));
        promptUser();
    });
  };
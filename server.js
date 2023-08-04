// require all neccessary files
const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");



// Database Connect and Starter Title
connection.connect((error) => {
  // catch all errors
  if (error) throw error;
  console.log(
    chalk.blue(
      `====================================================================================`
    )
  );
  console.log(``);

  console.log(chalk.cyanBright(figlet.textSync("Employee-Tracker")));

  console.log(`                                                          ` + chalk.cyanBright.bold("Author: Jacob Lausier"));

  console.log(

    chalk.blue(`====================================================================================`));

  promptUser();

});
const promptUser = () => {
  inquirer
  // cycle through all choices or allow exit of node.js app
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Select an option:",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employees By Department",
          "View Department Budgets",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Remove Employee",
          "Remove Role",
          "Remove Department",
          "Exit",
        ],
      },
    ])
    // answers to the prompt, once choice selected display relevent table. 
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View All Employees") {
        viewAllEmployees();
      }

      if (choices === "View All Departments") {
        viewAllDepartments();
      }

      if (choices === "View All Employees By Department") {
        viewEmployeesByDepartment();
      }

      if (choices === "Add Employee") {
        addEmployee();
      }

      if (choices === "Remove Employee") {
        removeEmployee();
      }

      if (choices === "Update Employee Role") {
        updateEmployeeRole();
      }

      if (choices === "Update Employee Manager") {
        updateEmployeeManager();
      }

      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "Add Role") {
        addRole();
      }

      if (choices === "Remove Role") {
        removeRole();
      }

      if (choices === "Add Department") {
        addDepartment();
      }

      if (choices === "View Department Budgets") {
        viewDepartmentBudget();
      }

      if (choices === "Remove Department") {
        removeDepartment();
      }

      if (choices === "Exit") {
        connection.end();
      }
    });
};


// View All Employees with the department they work, salary and employee id
const viewAllEmployees = () => {
  let sql = `SELECT employee.id, 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.department_name AS 'department', 
                    role.salary
                    FROM employee, role, department 
                    WHERE department.id = role.department_id 
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;
  connection.promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(chalk.magenta.bold(`====================================================================================`));
      console.log(`                              ` + chalk.cyan.bold(`Current Employees:`));
      console.log(chalk.magenta.bold(`====================================================================================`));
      console.table(rows);
      console.log(chalk.magenta.bold(`====================================================================================`));
      promptUser();
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while getting employees:", error);
    });
};



// View all Roles in each department
const viewAllRoles = () => {
  let sql = `SELECT role.id, role.title, department.department_name AS department
                    FROM role
                    INNER JOIN department ON role.department_id = department.id`;

  connection.promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log(chalk.magenta.bold(`====================================================================================`));
      console.log(`                              ` + chalk.cyan.bold(`Current Employee Roles:`));
      console.log(chalk.magenta.bold(`====================================================================================`));
      rows.forEach((role) => {
        console.log(role.title);
      });
      console.log(chalk.magenta.bold(`====================================================================================`));
      promptUser();
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while getting roles:", error);
    });
};



// View all Departments
const viewAllDepartments = () => {
  let sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.promise()
  .query(sql)
  .then (([rows, fields]) => {
    console.log(
      `                              ` + chalk.cyan.bold(`Departments:`)
    );
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    console.table(rows);
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    promptUser();
  })
  .catch((error) => {
    console.error("Error while getting departments: ", error)
  })
};


// View all Employees by Department including employee id and role id
const viewEmployeesByDepartment = () => {
  let sql = `SELECT employee.first_name, 
                    employee.last_name, 
                    department.department_name AS department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    // catch all errors
    if (error) throw error;
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );

    console.log(
      `                              ` +
        chalk.cyan.bold(`Employees by Departments:`)
    );
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );

    console.table(response);

    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
};
//View all Departments by Budget
const viewDepartmentBudget = () => {
  console.log(
    chalk.magenta.bold(
      `====================================================================================`
    )
  );

  console.log(
    `                              ` + chalk.cyan.bold(`Budgets By Department:`)
  );

  console.log(
    chalk.magenta.bold(
      `====================================================================================`
    )
  );
  const sql = `SELECT department_id AS id, 
                    department.department_name AS department,
                    SUM(salary) AS budget
                    FROM  role  
                    INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
  connection.query(sql, (error, response) => {
    // catch all errors
    if (error) throw error;
    console.table(response);

    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
};


// Add a New Employee
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName", 
        message: "First name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      
      },
    ])
    // use answer to create new employee
    .then((answer) => {
      const crit = [answer.firstName, answer.lastName]; 
      const roleSql = `SELECT role.id, role.title FROM role`;
      
      connection.promise().query(roleSql)
        .then(([data]) => {
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
          return inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "Employee's role?",
              choices: roles,
            },
          ]);
        })
        .then((roleChoice) => {
          const role = roleChoice.role;
          crit.push(role);
          const managerSql = `SELECT * FROM employee`;
          return connection.promise().query(managerSql);
        })
        .then(([data]) => {
          const managers = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));
          return inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Employee's manager?",
              choices: managers,
            },
          ]);
        })
        // select employees manager
        .then((managerChoice) => {
          const manager = managerChoice.manager;
          crit.push(manager);
          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

          return connection.promise().query(sql, crit);
        })
        .then(() => {
          console.log("Employee has been added!");
          viewAllEmployees();
        })
        .catch((error) => {
          console.error("Error while adding employee:", error);
        });
    });
};

// Add a New Role, select from departments to add roles into. 
const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.promise().query(sql)
    .then(([response]) => {
      let deptNamesArray = [];
      response.forEach((department) => {
        deptNamesArray.push(department.department_name);
      });
      deptNamesArray.push("Create Department");
      inquirer
        .prompt([
          {
            name: "departmentName",
            type: "list",
            message: "Which department is this new role in?",
            choices: deptNamesArray,
          },
        ])
        .then((answer) => {
          if (answer.departmentName === "Create Department") {
            addDepartment();
          } else {
            const selectedDepartment = response.find(department => department.department_name === answer.departmentName);
            addRoleResume(selectedDepartment);
          }
        });
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while fetching department data:", error);
    });
};

const addRoleResume = async (departmentData) => {
  const departmentsArray = Array.isArray(departmentData) ? departmentData : [departmentData];

  try {
    const answer = await inquirer.prompt([
      {
        name: "newRole",
        type: "input",
        message: "What is the name of your new role?",
       
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of this new role?",
        
      },
    ]);

    let createdRole = answer.newRole;
    let departmentId;

    departmentsArray.forEach((department) => {
      if (answer.departmentName === department.department_name) {
        departmentId = department.id;
      }
    });

    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const crit = [createdRole, answer.salary, departmentId];

    await connection.promise().query(sql, crit);
    
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    console.log(chalk.cyanBright(`Role successfully created!`));
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    
    viewAllRoles();
    // catch all errors
  } catch (error) {
    console.error("Error while creating role:", error);
  }
};




    
// Add a New Department
const addDepartment = () => {
  let newDepartmentName; 
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of your new Department?",
      },
    ])
    // add department
    .then((answer) => {
      newDepartmentName = answer.newDepartment; 
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      return connection.promise().query(sql, newDepartmentName);
    })
    .then(([result, fields]) => {
      console.log(chalk.cyanBright(newDepartmentName + ` Department successfully created!`));
      viewAllDepartments();
    })
    .catch((error) => {
      console.error("Error while adding department:", error);
    });
};




// Update an Employee's Role
const updateEmployeeRole = () => {
  let employeeNamesArray;
  let employeeRows; 
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection.promise().query(sql)
    .then(([rows]) => {
      employeeRows = rows;
      employeeNamesArray = [];
      rows.forEach((employee) => {
        employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
      });
      let sql = `SELECT role.id, role.title FROM role`;
      return connection.promise().query(sql);
    })
    // create new array
    .then(([response]) => {
      let rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new role?",
            choices: employeeNamesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        //update new title and emplyoee id
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          employeeRows.forEach((employee) => { 
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(sqls, [newTitleId, employeeId], (error) => {
            // catch all errors
            if (error) throw error;


            console.log(
              chalk.cyanBright.bold(
                `====================================================================================`
              )
            );

            console.log(chalk.cyanBright(`Employee Role Updated`));
            console.log(
              chalk.cyanBright.bold(
                `====================================================================================`
              )
            );
            promptUser();
          });
        });
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while fetching employee and role data:", error);
    });
};






// Update an Employee's Manager
const updateEmployeeManager = () => {
  let employeeNamesArray;
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee`;
  connection.promise().query(sql)
    .then(([rows]) => {
      employeeNamesArray = [];
      rows.forEach((employee) => {
        employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
      });

      let sql = `SELECT role.id, role.title FROM role`;
      return connection.promise().query(sql)
        .then(([roles]) => {
          inquirer
            .prompt([
              {
                name: "chosenEmployee",
                type: "list",
                message: "Which employee has a new manager?",
                choices: employeeNamesArray,
              },
              {
                name: "newManager",
                type: "list",
                message: "Their manager?",
                choices: employeeNamesArray,
              },
            ])
            .then((answers) => {
              let employeeId, managerId;

              roles.forEach((role) => {
                if (answers.chosenRole === role.title) {
                  newTitleId = role.id;
                }
              });

              rows.forEach((employee) => {
                if (
                  answers.chosenEmployee ===
                  `${employee.first_name} ${employee.last_name}`
                ) {
                  employeeId = employee.id;
                }
                if (
                  answers.newManager === `${employee.first_name} ${employee.last_name}`
                ) {
                  managerId = employee.id;
                }
              });
               {
                let updateSql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

                connection.query(updateSql, [managerId, employeeId], (error) => {
                  if (error) throw error;
                  console.log(
                    chalk.cyanBright.bold(
                      `====================================================================================`
                    )
                  );
                  console.log(chalk.cyanBright(`Employee Manager Updated`));
                  console.log(
                    chalk.cyanBright.bold(
                      `====================================================================================`
                    )
                  );
                  promptUser();
                });
              }
            });
        });
    })

    // catch all errors
    .catch((error) => {
      console.error("Error while fetching employee data:", error);
    });
};



// delete employee
const removeEmployee = () => {
  let sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name FROM employee`;
  connection.promise().query(sql)
    .then(([response]) => {
      let employeeNamesArray = [];
      response.forEach((employee) => {
        employeeNamesArray.push(employee.employee_name);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee would you like to remove?",
            choices: employeeNamesArray,
          },
        ])
        .then((answer) => {
          let employeeId;

          response.forEach((employee) => {
            if (answer.chosenEmployee === employee.employee_name) {
              employeeId = employee.id;
            }
          });

          let deleteSql = `DELETE FROM employee WHERE employee.id = ?`;
          connection.promise().query(deleteSql, [employeeId])
            .then(() => {
              console.log(
                chalk.red.bold(
                  `====================================================================================`
                )
              );
              console.log(chalk.cyanBright(`Employee Successfully Removed`));
              console.log(
                chalk.red.bold(
                  `====================================================================================`
                )
              );
              viewAllEmployees();
            })
            // catch all errors
            .catch((error) => {
              throw error;
            });
        });
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while getting employees data:", error);
    });
};




// Delete a Role

const removeRole = () => {
  let sql = `SELECT role.id, role.title FROM role`;

  connection.promise().query(sql)
    .then(([response]) => {
      let roleNamesArray = [];
      response.forEach((role) => {
        roleNamesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenRole",
            type: "list",
            message: "Which role would you like to remove?",
            choices: roleNamesArray,
          },
        ])
        .then((answer) => {
          let roleId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let deleteSql = `DELETE FROM role WHERE role.id = ?`;
          connection.promise().query(deleteSql, [roleId])
            .then(() => {

              console.log(
                chalk.red.bold(
                  `====================================================================================`
                )
              );
              console.log(chalk.cyanBright(`Role Successfully Removed`));
              console.log(
                chalk.red.bold(
                  `====================================================================================`
                )
              );
              viewAllRoles();
            })
            // catch all errors
            .catch((error) => {
              throw error;
            });
        });
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while fetching roles data:", error);
    });
};

// Delete a Department
const removeDepartment = () => {
  let sql = `SELECT department.id, department.department_name FROM department`;
  connection.promise().query(sql)
    .then(([response]) => {
      let departmentNamesArray = [];
      response.forEach((department) => {
        departmentNamesArray.push(department.department_name);
      });

      inquirer
        .prompt([
          {
            name: "chosenDept",
            type: "list",
            message: "Remove?",
            choices: departmentNamesArray,
          },
        ])
        .then((answer) => {
          let departmentId;

          response.forEach((department) => {
            if (answer.chosenDept === department.department_name) {
              departmentId = department.id;
            }
          });

          let deleteSql = `DELETE FROM department WHERE department.id = ?`;
          connection.promise().query(deleteSql, [departmentId])
            .then(() => {
              console.log(
                chalk.red.bold(
                  `====================================================================================`
                )
              );
              console.log(chalk.red(`Department Successfully Removed`));
              console.log(
                chalk.red.bold(
                  `====================================================================================`
                )
              );
              viewAllDepartments();
            })
            // catch all errors
            .catch((error) => {
              throw error;
            });
        });
    })
    // catch all errors
    .catch((error) => {
      console.error("Error while getting departments data:", error);
    });
};

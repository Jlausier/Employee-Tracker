INSERT INTO department(department_name)
VALUES("Engineering"), ("Web Development"), ("Customer Service"), ("Legal"), ("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES("Engineer", 80000, 1), ("Senior Engineer", 127050, 1), ("CFO", 35120, 3), ("Junior Developer", 82000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Shmoe', 1, 2), ('tyrique', 'Smith', 1, null), ('Mallory', 'Manning', 1, 2), ('Slim', 'Jim', 2, 2), ('Adam', 'Web Development', 4, null);
const mysql = require('mysql2/promise');
const csv = require('csv-parser');
const fs = require('fs');

//This file has the different functions needed to import csv files

const { promisify } = require('util');
const streamPipeline = promisify(require('stream').pipeline);

async function importCSVData(filePath, insertQuery, columns) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'ChatBotAdmin',
    password: 'ChatBot2024',
    database: 'university'
  });

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
    //   const values = columns.map(column => row[column]);
      const values = columns.map(column => (column === 'requirement_type_id' && row[column] === '') ? null : row[column]);

      try {
        await connection.execute(insertQuery, values);
        console.log('Inserted:', values);
      } catch (err) {
        console.error('Error:', err);
      }
    })
    .on('end', async () => {
      console.log(`${filePath} successfully processed`);
      await connection.end();
    });
}


// Make sure to replace 'path_to_departments_csv.csv' and 'your_password' with your actual file path and password.

// Importing data into the Departments table
// importCSVData(
//   'C:/Users/Hutton Smith/Downloads/Departments.csv', 
//   'INSERT INTO departments (department_id, name, abbreviation) VALUES (?, ?, ?)',
//   ['department_id', 'name', 'abbreviation']
// );



// // Importing data into the RequirementType table
// importCSVData(
//     'C:/Users/Hutton Smith/Downloads/RequirementTypes.csv', // Replace with the path to your CSV file
//     'INSERT INTO RequirementType (requirement_type_id, requirement) VALUES (?, ?)',
//     ['requirement_type_id', 'requirement'] // Columns in your CSV file
//   );


// // Importing data into the Courses table
// importCSVData(
//     'C:/Users/Hutton Smith/Downloads/Courses.csv', // Replace with the path to your CSV file
//     'INSERT INTO Courses (code, name, department_id, credits, requirement_type_id) VALUES (?, ?, ?, ?, ?)',
//     ['code', 'name', 'department_id', 'credits', 'requirement_type_id'] // Columns in your CSV file
//   );


async function getRequirementTypeId(connection, requirementName) {
    const [rows] = await connection.execute('SELECT requirement_type_id FROM RequirementType WHERE requirement = ?', [requirementName]);
    if (rows.length > 0) {
        return rows[0].requirement_type_id;
    } else {
        throw new Error(`Requirement type not found for: ${requirementName}`);
    }
}

async function importCSVData(filePath, insertQuery) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'ChatBotAdmin',
        password: 'ChatBot2024',
        database: 'university'
    });

    const dataProcessingPromises = [];

    await streamPipeline(
        fs.createReadStream(filePath),
        csv(),
        async function* (source) {
            for await (const row of source) {
                try {
                    const requirementTypeId = await getRequirementTypeId(connection, row.requirement_type_id);
                    const values = [requirementTypeId, row.required_credits];
                    console.log('Values:', values);
                    const queryPromise = connection.execute(insertQuery, values);
                    dataProcessingPromises.push(queryPromise);
                    yield;
                } catch (err) {
                    console.error('Error:', err);
                    yield;
                }
            }
        }
    );

    await Promise.all(dataProcessingPromises);
    console.log('All data processed');
    await connection.end();
}

// // Importing data into the GeneralEducationRequirements table
// importCSVData(
//     'C:/Users/Hutton Smith/Downloads/GenEdRequirements.csv',
//     'INSERT INTO GeneralEducationRequirements (requirement_type_id, required_credits) VALUES (?, ?)'
// );




// //program requirements


// Function to fetch department_id based on department name
async function getDepartmentId(connection, departmentName) {
    const [rows] = await connection.execute('SELECT department_id FROM Departments WHERE name = ?', [departmentName]);
    if (rows.length > 0) {
        return rows[0].department_id;
    } else {
        throw new Error(`Department not found for: ${departmentName}`);
    }
}

// Function to fetch course_id based on course code, returns null if course code is empty
async function getCourseId(connection, courseCode) {
    if (!courseCode) return null;
    const [rows] = await connection.execute('SELECT course_id FROM Courses WHERE code = ?', [courseCode]);
    if (rows.length > 0) {
        return rows[0].course_id;
    } else {
        return null; // If course code is not found, it's treated as an optional field
    }
}

// Function to fetch requirement_type_id based on the requirement
async function getRequirementTypeId(connection, requirementName) {
    const [rows] = await connection.execute('SELECT requirement_type_id FROM RequirementType WHERE requirement = ?', [requirementName]);
    if (rows.length > 0) {
        return rows[0].requirement_type_id;
    } else {
        throw new Error(`Requirement type not found for: ${requirementName}`);
    }
}

async function importCSVData(filePath, insertQuery) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'ChatBotAdmin',
        password: 'ChatBot2024',
        database: 'university'
    });

    const processingPromises = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const processRow = async () => {
                try {
                    const departmentId = await getDepartmentId(connection, row.department_id);
                    const courseId = await getCourseId(connection, row.course_id);
                    const requirementTypeId = await getRequirementTypeId(connection, row.requirement_type_id);
                    const values = [departmentId, courseId, requirementTypeId, row.required_credits];
                    await connection.execute(insertQuery, values);
                    console.log('Inserted:', values);
                } catch (err) {
                    console.error('Error:', err);
                }
            };
            processingPromises.push(processRow());
        })
        .on('end', async () => {
            await Promise.all(processingPromises);
            console.log('All data processed');
            await connection.end();
        });
}

// // // Importing data into the ProgramRequirements table
// importCSVData(
//     'C:/Users/Hutton Smith/Downloads/ProgramRequirements.csv',
//     'INSERT INTO ProgramRequirements (department_id, course_id, requirement_type_id, required_credits) VALUES (?, ?, ?, ?)'
// );

// // Function to fetch department_id based on department name
async function getDepartmentId(connection, departmentName) {
    const [rows] = await connection.execute('SELECT department_id FROM Departments WHERE name = ?', [departmentName]);
    if (rows.length > 0) {
        return rows[0].department_id;
    } else {
        throw new Error(`Department not found for: ${departmentName}`);
    }
}

// Function to fetch course_id based on course code
async function getCourseId(connection, courseCode) {
    if (!courseCode) return null;
    const [rows] = await connection.execute('SELECT course_id FROM Courses WHERE code = ?', [courseCode]);
    if (rows.length > 0) {
        return rows[0].course_id;
    } else {
        return null;
    }
}

// Function to fetch requirement_type_id based on the requirement
async function getRequirementTypeId(connection, requirementName) {
    if (!requirementName) return null;  // Check if requirementName is empty
    const [rows] = await connection.execute('SELECT requirement_type_id FROM RequirementType WHERE requirement = ?', [requirementName]);
    if (rows.length > 0) {
        return rows[0].requirement_type_id;
    } else {
        console.error(`Requirement type not found for: ${requirementName}`);  // Log if no matching requirement type is found
        return null;
    }
}
// Function to import CSV data into the SemesterRecommendations table
async function importCSVData(filePath, insertQuery) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'ChatBotAdmin',
        password: 'ChatBot2024',
        database: 'university'
    });

    const processingPromises = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            const processRow = async () => {
                try {
                    const departmentId = await getDepartmentId(connection, row.department_id);
                    const courseId = await getCourseId(connection, row.course_id);
                    const requirementTypeId = await getRequirementTypeId(connection, row.requirement_type_id);
                    const values = [departmentId, courseId, requirementTypeId, row.recommendation_semester];
                    await connection.execute(insertQuery, values);
                    console.log('Inserted:', values);
                } catch (err) {
                    console.error('Error:', err);
                }
            };
            processingPromises.push(processRow());
        })
        .on('end', async () => {
            await Promise.all(processingPromises);
            console.log('All data processed');
            await connection.end();
        });
}

// Importing data into the SemesterRecommendations table
importCSVData(
    'C:/Users/Hutton Smith/Downloads/SemesterRecommendations.csv',
    'INSERT INTO SemesterRecommendations (department_id, course_id, requirement_type_id, recommended_semester) VALUES (?, ?, ?, ?)'
);
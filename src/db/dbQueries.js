const pool = require('./dbConnect');


// async function getDepartmentDetails(departmentIdentifier) {
//     let query;
//     if (Number.isInteger(departmentIdentifier)) {
//         query = 'SELECT * FROM Departments WHERE department_id = ?';
//     } else {
//         query = 'SELECT * FROM Departments WHERE name = ? OR abbreviation = ?';
//     }

//     const [rows] = await pool.query(query, [departmentIdentifier.departmentIdentifier, departmentIdentifier.departmentIdentifier]);
//     return rows;
// }

// async function getCourseDetails(courseIdentifier) {
//     let query;
//     if (Number.isInteger(courseIdentifier)) {
//         query = 'SELECT * FROM Courses WHERE course_id = ?';
//     } else {
//         query = 'SELECT * FROM Courses WHERE code = ?';
//     }

//     const [rows] = await pool.query(query, [courseIdentifier]);
//     return rows;
// }


// async function getProgramRequirements(departmentId, requirementTypeId) {
//     const query = `
//         SELECT * FROM ProgramRequirements
//         WHERE department_id = ? AND requirement_type_id = ?;
//     `;

//     const [rows] = await pool.query(query, [departmentId, requirementTypeId]);
//     return rows;
// }

// async function getGeneralEducationRequirements(requirementTypeId = null) {
//     let query = 'SELECT * FROM GeneralEducationRequirements';
//     let params = [];

//     if (requirementTypeId) {
//         query += ' WHERE requirement_type_id = ?';
//         params.push(requirementTypeId);
//     }

//     const [rows] = await pool.query(query, params);
//     return rows;
// }

// async function getRequirementTypes(requirementType) {
//     const query = 'SELECT * FROM RequirementType WHERE requirement = ?';
//     const [rows] = await pool.query(query, [requirementType]);
//     return rows;
// }

// async function getSemesterRecommendations(departmentId, semester) {
//     const query = `
//         SELECT * FROM SemesterRecommendations
//         WHERE department_id = ? AND recommended_semester = ?;
//     `;

//     const [rows] = await pool.query(query, [departmentId, semester]);
//     return rows;
// }


async function getDepartmentDetails(identifier) {
    console.log(identifier)
    const query = `
        SELECT * FROM Departments 
        WHERE department_id = ? OR name = ? OR abbreviation = ?
    `;
    const [rows] = await pool.query(query, [identifier, identifier, identifier]);
    return rows;
}

async function getRequirementType(identifier) {
    const query = `
        SELECT * FROM RequirementType 
        WHERE requirement_type_id = ? OR requirement = ?
    `;
    const [rows] = await pool.query(query, [identifier, identifier]);
    return rows;
}

async function getCourseDetails(identifier) {
    const query = `
        SELECT * FROM Courses 
        WHERE course_id = ? OR code = ?
    `;
    const [rows] = await pool.query(query, [identifier, identifier]);
    return rows;
}

async function getProgramRequirements(departmentId = null, requirementTypeId = null) {
    let query = `SELECT * FROM ProgramRequirements`;
    const conditions = [];
    const params = [];

    if (departmentId) {
        conditions.push('department_id = ?');
        params.push(departmentId);
    }
    if (requirementTypeId) {
        conditions.push('requirement_type_id = ?');
        params.push(requirementTypeId);
    }

    if (conditions.length) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await pool.query(query, params);
    return rows;
}

async function getGeneralEducationRequirements(requirementTypeId = null) {
    let query = 'SELECT * FROM GeneralEducationRequirements';
    const params = [];

    if (requirementTypeId) {
        query += ' WHERE requirement_type_id = ?';
        params.push(requirementTypeId);
    }

    const [rows] = await pool.query(query, params);
    return rows;
}

async function getSemesterRecommendations(departmentId, semester) {
    const query = `
        SELECT * FROM SemesterRecommendations 
        WHERE department_id = ? AND recommended_semester = ?
    `;
    const [rows] = await pool.query(query, [departmentId, semester]);
    return rows;
}

module.exports = { 
    getDepartmentDetails, 
    getCourseDetails, 
    getProgramRequirements, 
    getRequirementType, 
    getGeneralEducationRequirements,
    getSemesterRecommendations
};
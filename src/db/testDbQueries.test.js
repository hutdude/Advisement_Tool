const pool = require('./dbConnect');
const {
    getDepartmentDetails,
    getCourseDetails,
    getProgramRequirements,
    getRequirementType,
    getGeneralEducationRequirements,
    getSemesterRecommendations
} = require('./dbQueries');

jest.mock('./dbConnect', () => ({
    query: jest.fn()
}));

describe('Database Queries', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDepartmentDetails', () => {
        it('should fetch department details by department identifier', async () => {
            const identifier = "CSE";
            const expectedQuery = 'SELECT * FROM Departments WHERE department_id = ?';
            const expectedParams = [identifier];

            await getDepartmentDetails(identifier);

            expect(pool.query).toHaveBeenCalledWith(expectedQuery, [identifier, identifier, identifier]);
        });

        it('should fetch department details by name or abbreviation', async () => {
            const identifier = 'CSE';
            const expectedQuery = 'SELECT * FROM Departments WHERE department_id = ? OR name = ? OR abbreviation = ?';
            const expectedParams = [identifier, identifier, identifier];

            await getDepartmentDetails(identifier);

            expect(pool.query).toHaveBeenCalledWith(expectedQuery, [identifier, identifier, identifier]);
        });
    });

    describe('getRequirementType', () => {
        it('should fetch requirement type by identifier', async () => {
            const identifier = 456;
            const expectedQuery = 'SELECT * FROM RequirementType WHERE requirement_type_id = ?';
            const expectedParams = [identifier];

            await getRequirementType(identifier);

            expect(pool.query).toHaveBeenCalledWith(expectedQuery, [identifier, identifier]);
        });

        it('should fetch requirement type by requirement', async () => {
            const identifier = 'Test';
            const expectedQuery = 'SELECT * FROM RequirementType WHERE requirement_type_id = ? OR requirement = ?';
            const expectedParams = [identifier, identifier];

            await getRequirementType(identifier);

            expect(pool.query).toHaveBeenCalledWith(expectedQuery, [identifier, identifier]);
        });
    });

});

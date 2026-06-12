export const transactionServiceMock = () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    processCsv: jest.fn(),
})
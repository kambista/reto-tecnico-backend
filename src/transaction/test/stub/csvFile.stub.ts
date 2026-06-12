export const csvFileStub = (): Express.Multer.File => ({
    buffer: Buffer.from('customerId,amountUsd\n1,100'),
    originalname: 'transactions.csv',
} as Express.Multer.File); 
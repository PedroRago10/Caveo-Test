import logger from '../logger';

describe('Logger Tests', () => {
    let logInfoSpy: jest.SpyInstance;
    let logErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        logInfoSpy = jest.spyOn(logger, 'info');
        logErrorSpy = jest.spyOn(logger, 'error');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log an informational message', () => {
        const message = 'Teste de log de informação';
        logger.info(message);
        expect(logInfoSpy).toHaveBeenCalledWith(message);
        expect(logInfoSpy).toHaveBeenCalledTimes(1);
    });

    it('should log an error message', () => {
        const message = 'Teste de log de erro';
        logger.error(message);
        expect(logErrorSpy).toHaveBeenCalledWith(message);
        expect(logErrorSpy).toHaveBeenCalledTimes(1);
    });
});

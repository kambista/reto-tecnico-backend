import { ArgumentsHost, BadRequestException, Catch, HttpStatus } from "@nestjs/common";

@Catch(BadRequestException)
export class CustomValidationExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        let ErrorCode = 'VALIDATION_ERROR';
        let errorMessage = 'Validation failed';

        if (typeof exceptionResponse === 'object' && exceptionResponse.message) {
            const messages = exceptionResponse.message;
            if (Array.isArray(messages) && messages.length > 0) {
                errorMessage = messages[0];

                if (errorMessage.includes('amountUsd')) {
                    ErrorCode = 'INVALID_AMOUNT';
                }
                if (errorMessage.includes('customerId')) {
                    ErrorCode = 'INVALID_CUSTOMER_ID';
                }
            } else if (typeof messages === 'string') {
                errorMessage = messages;
            }
        }

        response.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            error: {
                code: ErrorCode,
                message: errorMessage
            }
        });
    }
}
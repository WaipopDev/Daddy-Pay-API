import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { KbankService } from './kbank.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_MESSAGES } from 'src/constants/http-status.constant';

@ApiTags('Kbank')
@Controller('kbank')
export class KbankController {
    constructor(private readonly kbankService: KbankService) { }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 400, description: HTTP_STATUS_MESSAGES[400] })
    @Post('callback')
    async callbackKbank(
        @Body() payload: any, // Define the payload type according to your needs
    ): Promise<{
        resCode: string;
        resDesc: string;
        transactionId: string;
        confirmId: string;
    }> {
        try {
            // console.log('payload', payload)
            await this.kbankService.setDataCallback(payload);
            return {
                resCode: "00",
                resDesc: "success",
                transactionId: '',
                confirmId: "",
            }
        } catch (error) {
            console.error('Error in callbackKbank: ', error);
            throw new HttpException({
                resCode: "99",
                resDesc: "error",
                transactionId: '',
                confirmId: "",
            }, HttpStatus.BAD_REQUEST);;
        }
    }

    @ApiResponse({ status: 200, description: HTTP_STATUS_MESSAGES[200] })
    @ApiResponse({ status: 400, description: HTTP_STATUS_MESSAGES[400] })
    @Post('generate')
    async generateKbank(
        @Body() payload: any, // Define the payload type according to your needs
    ) {
        try {
            // console.log('payload', payload)
           const respons = await this.kbankService.generateKbank(payload);
            return respons;
        } catch (error) {
            console.error('Error in generateKbank: ', error);
            throw new HttpException({
                resCode: "99",
                resDesc: "error",
                transactionId: '',
                confirmId: "",
            }, HttpStatus.BAD_REQUEST);;
        }
    }

}

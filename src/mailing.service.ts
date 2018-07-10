import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {
    public send(): string {
        

        return 'sent';
    }
}
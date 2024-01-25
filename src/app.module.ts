import { Module } from '@nestjs/common';
import { StepProductionModule } from './step-production/step-production.module';
import { ErpModule } from './erp/erp.module';
import { ConfigModule } from '@nestjs/config';
import { ActionModule } from './actions/actions.module';
import { MachineModule } from './machine/machine.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes the config globally available
        }),
        StepProductionModule,
        ErpModule,
        ActionModule,
        MachineModule,
        PdfModule,
    ],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { ListMachineDTO } from './dto/machine-program.dto';

@Injectable()
export class MachineProgramService {

    async getMachine(): Promise<ListMachineDTO> {
        // Simulate fetching machine data
        const machineData = {
            branchName: 'item.branchName',
            idBranch: 'item.idBranch',
            idMachine: 'item.id',
            machineName: 'item.name',
            intervalTime: 60,
            status: 'status',
            errorMsg: '',
            program: [
                {
                    id: 'item.id',
                    name: 'item.name',
                    description: 'item.description',
                    status: 'status',
                    order: 'item.order',
                    price: 'item.price',
                    type: 'item.type',
                    time: 60,
                }
            ]
        }

        return machineData;
    }
}

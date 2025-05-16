import { Injectable } from '@nestjs/common';
import { LOGGER } from 'src/constants/collection-firebase';
import { FirebaseService } from 'src/firebase/firebase.service';


interface IActivityLog {
   refId      : string;
   role       : string;
   userId    ?: number | null;
   username  ?: string | null;
   path       : string;
   method     : string;
   ip         : string;
   referer   ?: string | null;
   token     ?: string | null;
   statusCode?: number;
   payload   ?: any;
   response  ?: any;
}
@Injectable()
export class LoggerRepository {
    constructor(
        private readonly firebaseService: FirebaseService,
    ) { }

    async logActivity(activity: IActivityLog) {
        const firestore = this.firebaseService.getFirestore();
        const docRef = firestore.collection(LOGGER);
        const setData = {
            ...activity,
            createdAt: new Date(),
        }
        await docRef.add(setData);
    }
}

import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { KB_CALLBACK } from 'src/constants/collection-firebase';
@Injectable()
export class KbankService {
    constructor(
        private readonly firebaseService: FirebaseService,
    ) { }

    async setDataCallback(data: any): Promise<void> {
        try {
            const firestore = this.firebaseService.getFirestore();
            const docRef = firestore.collection(KB_CALLBACK);
            await docRef.add(data);
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    }

}

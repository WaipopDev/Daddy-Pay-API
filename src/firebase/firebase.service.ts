import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-key.json';
@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    onModuleInit() {
        this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
        });
    }

    getFirestore(): admin.firestore.Firestore {
        return admin.firestore(this.firebaseApp);
    }

    getAuth(): admin.auth.Auth {
        return admin.auth(this.firebaseApp);
    }

}

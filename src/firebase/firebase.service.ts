import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-key.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    onModuleInit() {
        this.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET 
        });
    }

    getFirestore(): admin.firestore.Firestore {
        return admin.firestore(this.firebaseApp);
    }

    getAuth(): admin.auth.Auth {
        return admin.auth(this.firebaseApp);
    }

    getStorage(): admin.storage.Storage {
        return admin.storage(this.firebaseApp);
    }

    async uploadFile(buffer: Buffer, fileName: string, folder: string = 'shop-files'): Promise<string> {
        const bucket = this.getStorage().bucket();
        const file = bucket.file(`${folder}/${fileName}`);
        
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'auto',
            },
        });

        return new Promise((resolve, reject) => {
            stream.on('error', (error) => {
                reject(error);
            });

            stream.on('finish', async () => {
                try {
                    // Make the file publicly accessible
                    await file.makePublic();
                    
                    // Get the public URL
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                    resolve(publicUrl);
                } catch (error) {
                    reject(error);
                }
            });

            stream.end(buffer);
        });
    }

    async deleteFile(fileName: string, folder: string = 'shop-files'): Promise<void> {
        const bucket = this.getStorage().bucket();
        const file = bucket.file(`${folder}/${fileName}`);
        
        try {
            await file.delete();
        } catch (error) {
            console.error('Error deleting file:', error);
            // Don't throw error if file doesn't exist
        }
    }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    onModuleInit() {
        // วิธีที่ 1: ใช้ environment variables (แนะนำ)
        if (process.env.FIREBASE_PRIVATE_KEY) {
            const serviceAccount = {
                type: 'service_account',
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                token_uri: 'https://oauth2.googleapis.com/token',
                auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
                client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
            };

            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        } else {
            // วิธีที่ 2: ใช้ JSON file (fallback)
            const path = require('path');
            const serviceAccount = require(path.join(process.cwd(), 'firebase-key.json'));
            const serviceAccountCopy = JSON.parse(JSON.stringify(serviceAccount));
            
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccountCopy as admin.ServiceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        }
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

    // เพิ่ม method สำหรับ Realtime Database
    getDatabase(): admin.database.Database {
        return admin.database(this.firebaseApp);
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

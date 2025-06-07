import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LangListEntity } from 'src/models/entities/LangList.entity';
import { ResponseLanguageDto } from 'src/language/dto/language.dto';
import { FirebaseService } from 'src/firebase/firebase.service';

export class LanguageRepository {
   constructor(
      @InjectEntityManager() private readonly db: EntityManager,
      private readonly firebaseService: FirebaseService
   ) { }

   private get repoMain() {
      return this.db.getRepository(LangMainEntity);
   }
   private get repoList() {
      return this.db.getRepository(LangListEntity);
   }

   async findList() {
      const database = this.firebaseService.getDatabase();
        const ref = database.ref(`LanguageList`);
         const snapshot = await ref.once('value');
         
         if (!snapshot.exists()) {
            return null;
         }
         
         const data = snapshot.val();
         return data
   }

   async findByCode(code: string) {
      try {
         const database = this.firebaseService.getDatabase();
         const ref = database.ref(`Language/${code.toUpperCase()}`);
         const snapshot = await ref.once('value');
         
         if (!snapshot.exists()) {
            return null;
         }
         
         const data = snapshot.val();
         return data;
      } catch (error) {
         console.error('Error fetching data from Firebase:', error);
         return null;
      }
   }

   async findById(id: number): Promise<LangMainEntity | null> {
      return this.repoMain.findOneBy({ id });
   }

   async create(data: Partial<LangMainEntity>): Promise<number> {

      const item = await this.repoMain.save(data);
      return item.id;
   }

   async createList(data: Partial<LangListEntity>): Promise<number> {

      const item = await this.repoList.save(data);
      return item.id;
   }

   async update(id: number, data: Partial<LangMainEntity>): Promise<void> {
      await this.repoMain.update(id, data);
   }

   async delete(id: number): Promise<void> {
      await this.repoMain.delete(id);
   }
}

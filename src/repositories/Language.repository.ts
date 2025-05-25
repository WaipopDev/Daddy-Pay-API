import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LangListEntity } from 'src/models/entities/LangList.entity';
import { ResponseLanguageDto } from 'src/language/dto/language.dto';

export class LanguageRepository {
   constructor(@InjectEntityManager() private readonly db: EntityManager) { }

   private get repoMain() {
      return this.db.getRepository(LangMainEntity);
   }
   private get repoList() {
      return this.db.getRepository(LangListEntity);
   }

   async findAll(): Promise<LangMainEntity[]> {
      return this.repoMain.find({
         where: { active: true },
         order: { langCode: 'ASC' },
      });
   }

   async findByCode(code: string): Promise<ResponseLanguageDto[] | null> {
      // return this.repoMain.find({
      //    where: { langCode: code },
      //    relations: ['langLists'], // ตรงกับชื่อ property @OneToMany
      // });
      return this.repoMain
         .createQueryBuilder('main')
         .leftJoinAndSelect('main.langLists', 'list')
         .where('main.langCode = :code', { code })
         .select([
            'list.langKey AS "langKey"',
            'list.langName AS "langName"',
         ])
         .orderBy('list.langKey', 'ASC')
         .getRawMany();
      // return this.repoMain.findOneBy({ langCode: code });
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

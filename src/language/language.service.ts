import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLanguageListDto, CreateLanguageMainDto } from './dto/create-language.dto';
import { UpdateLanguageMainDto } from './dto/update-language.dto';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LanguageRepository } from 'src/repositories/Language.repository';
import { LangListEntity } from 'src/models/entities/LangList.entity';
import { ResponseLanguageDto } from './dto/language.dto';
import _ from 'lodash';
@Injectable()
export class LanguageService {
    constructor(private languageRepository: LanguageRepository) { }
    
    async create(createLanguageMainDto: CreateLanguageMainDto, userId: number): Promise<number> {
        const checkCode = await this.languageRepository.findByCode(createLanguageMainDto.langCode)
        if (checkCode) {
            throw new UnauthorizedException('Language code already exists.');
        }
        const langMain           = new LangMainEntity()
              langMain.langCode  = createLanguageMainDto.langCode;
              langMain.langName  = createLanguageMainDto.langName;
              langMain.active    = createLanguageMainDto.active;
              langMain.createdBy = userId;
              langMain.updatedBy = userId;
        return await this.languageRepository.create(langMain);
    }

    async createList(createLanguageListDto: CreateLanguageListDto, userId: number): Promise<number> {
       
        const langList           = new LangListEntity()
              langList.langKey   = createLanguageListDto.langKey;
              langList.langName  = createLanguageListDto.langName;
              langList.langMain  = { id: createLanguageListDto.langMainId } as LangMainEntity;
              langList.createdBy = userId;
              langList.updatedBy = userId;
        return await this.languageRepository.createList(langList);
    }

   async findByCode(langCode: string) : Promise<{ [key: string]: string }> {
       return await this.languageRepository.findByCode(langCode);

    }

   async findList(){
      return  await this.languageRepository.findList()
    }

    findOne(id: number) {
        return `This action returns a #${id} language`;
    }

    update(id: number, updateLanguageDto: UpdateLanguageMainDto) {
        return `This action updates a #${id} language`;
    }

    remove(id: number) {
        return `This action removes a #${id} language`;
    }
}

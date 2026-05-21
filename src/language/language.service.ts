import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLanguageListDto, CreateLanguageMainDto } from './dto/create-language.dto';
import {
    DeleteLanguageResponseDto,
    SaveLanguageDto,
    SaveLanguageResponseDto,
    UpdateLanguageDto,
    UpdateLanguageResponseDto,
} from './dto/save-language.dto';
import { LangMainEntity } from 'src/models/entities/LangMain.entity';
import { LanguageRepository } from 'src/repositories/Language.repository';
import { LangListEntity } from 'src/models/entities/LangList.entity';
@Injectable()
export class LanguageService {
    constructor(private languageRepository: LanguageRepository) { }

    async create(createLanguageMainDto: CreateLanguageMainDto, userId: number): Promise<number> {
        const checkCode = await this.languageRepository.findByCode(createLanguageMainDto.langCode)
        if (checkCode) {
            throw new UnauthorizedException('Language code already exists.');
        }
        const langMain = new LangMainEntity()
        langMain.langCode = createLanguageMainDto.langCode;
        langMain.langName = createLanguageMainDto.langName;
        langMain.active = createLanguageMainDto.active;
        langMain.createdBy = userId;
        langMain.updatedBy = userId;
        return await this.languageRepository.create(langMain);
    }

    async createList(createLanguageListDto: CreateLanguageListDto, userId: number): Promise<number> {

        const langList = new LangListEntity()
        langList.langKey = createLanguageListDto.langKey;
        langList.langName = createLanguageListDto.langName;
        langList.langMain = { id: createLanguageListDto.langMainId } as LangMainEntity;
        langList.createdBy = userId;
        langList.updatedBy = userId;
        return await this.languageRepository.createList(langList);
    }

    async findByCode(langCode: string): Promise<{ [key: string]: string }> {
        return await this.languageRepository.findByCode(langCode);

    }

    async findList() {
        return await this.languageRepository.findList();
    }

    async save(dto: SaveLanguageDto): Promise<SaveLanguageResponseDto> {
        const langCode = dto.langCode.trim().toUpperCase();
        if (!dto.translations || Object.keys(dto.translations).length === 0) {
            throw new BadRequestException('Translations must not be empty.');
        }

        const exists = await this.languageRepository.existsLangCodeInFirebase(langCode);
        if (exists) {
            throw new ConflictException('Language code already exists.');
        }

        await this.languageRepository.saveLanguageToFirebase(langCode, dto.translations);
        await this.languageRepository.saveLanguageListEntryToFirebase(
            langCode,
            dto.langName,
        );

        return {
            message: 'Language saved to Firebase successfully.',
            langCode,
            langName: dto.langName,
        };
    }

    async update(
        langCode: string,
        dto: UpdateLanguageDto,
    ): Promise<UpdateLanguageResponseDto> {
        const code = langCode.trim().toUpperCase();
        if (!dto.translations || Object.keys(dto.translations).length === 0) {
            throw new BadRequestException('Translations must not be empty.');
        }

        const exists = await this.languageRepository.existsLangCodeInFirebase(code);
        if (!exists) {
            throw new NotFoundException('Language code does not exist.');
        }

        await this.languageRepository.saveLanguageToFirebase(code, dto.translations);
        await this.languageRepository.saveLanguageListEntryToFirebase(code, dto.langName);

        return {
            message: 'Language updated successfully.',
            langCode: code,
            langName: dto.langName,
        };
    }

    async remove(langCode: string): Promise<DeleteLanguageResponseDto> {
        const code = langCode.trim().toUpperCase();
        if (code === 'EN') {
            throw new ForbiddenException('Language code EN cannot be deleted.');
        }
        const exists = await this.languageRepository.existsLangCodeInFirebase(code);
        if (!exists) {
            throw new NotFoundException('Language code does not exist.');
        }

        await this.languageRepository.deleteLanguageFromFirebase(code);

        return {
            message: 'Language deleted successfully.',
            langCode: code,
        };
    }
}

import { Column, Entity, OneToMany } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { LangListEntity } from "./LangList.entity";

@Entity({ name: 'lang_main' })
export class LangMainEntity extends DefaultEntity  {
    @Column({ type: 'varchar', name: 'lang_code', length: 10, unique: true })
    langCode: string;

    @Column({ type: 'varchar', name: 'lang_name', length: 100 })
    langName: string;

    @Column({ type: 'boolean', name: 'active', default: true })
    active: boolean;

    @OneToMany(() => LangListEntity, (langList) => langList.langMain)
    langLists: LangListEntity[];
}

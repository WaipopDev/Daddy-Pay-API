import { Column, Entity, JoinColumn, ManyToOne, OneToOne, Relation } from "typeorm"
import { DefaultEntity } from "./default.entity";
import { LangMainEntity } from "./LangMain.entity";

@Entity({ name: 'lang_list' })
export class LangListEntity extends DefaultEntity {
    @ManyToOne(() => LangMainEntity, (langMain) => langMain.langLists)
    @JoinColumn({ name: 'lang_main_id' }) // FK field in LangList
    langMain: Relation<LangMainEntity>;

    @Column({ type: 'varchar', name: 'lang_key' })
    langKey: string;

    @Column({ type: 'varchar', name: 'lang_name' })
    langName: string;


}

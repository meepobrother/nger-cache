import {
    Column,
    Entity,
    PrimaryColumn,
    CreateDateColumn,
} from '@notadd/magnus-typeorm';

@Entity()
export class PGCacheEntity {

    @PrimaryColumn()
    key: string

    @Column({
        type: 'text',
        transformer: {
            from: (val: string) => {
                return JSON.parse(val)
            },
            to: (val: any) => {
                return JSON.stringify(val)
            }
        }
    })
    value: any;

	/**
	 * 创建时间
	 */
    @CreateDateColumn({
        type: 'timestamptz',
        name: 'create_time',
        transformer: {
            to: (value: string) => {
                let date = new Date();
                if (value) {
                    date = new Date(value);
                }
                return date;
            },
            from: (value: Date) => {
                return value.getTime();
            }
        }
    })
    createTime?: string;
}
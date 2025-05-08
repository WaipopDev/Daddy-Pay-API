#!/usr/bin/env ts-node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { basename, dirname, join } from 'path';

const args = process.argv.slice(2);
const fullPath = args[0];

if (!fullPath) {
  console.error('❌ กรุณาระบุชื่อ repository เช่น: generate-repository.ts user');
  process.exit(1);
}
const folderPath = join(__dirname, 'src', fullPath);
const name = basename(fullPath);
const className = `${capitalize(name)}Repository`;
const fileName = `${name}.repository.ts`;
// const folderPath = join(__dirname, 'src', name);
const filePath = join(folderPath, fileName);

if (!existsSync(folderPath)) {
  mkdirSync(folderPath, { recursive: true });
}

const content = `import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { ${capitalize(name)} } from './entities/${name}.entity';

@Injectable()
export class ${className} {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll(): Promise<${capitalize(name)}[]> {
    return this.knex<${capitalize(name)}>('${name}').select('*');
  }

  async findById(id: number): Promise<${capitalize(name)} | undefined> {
    return this.knex<${capitalize(name)}>('${name}').where({ id }).first();
  }

  async create(data: Partial<${capitalize(name)}>): Promise<number> {
    const [id] = await this.knex('${name}').insert(data).returning('id');
    return id;
  }

  async update(id: number, data: Partial<${capitalize(name)}>): Promise<void> {
    await this.knex('${name}').where({ id }).update(data);
  }

  async delete(id: number): Promise<void> {
    await this.knex('${name}').where({ id }).delete();
  }
}
`;

writeFileSync(filePath, content);
console.log(`✅ สร้าง ${fileName} สำเร็จที่ ${folderPath}`);

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
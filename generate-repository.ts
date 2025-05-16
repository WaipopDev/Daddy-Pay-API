#!/usr/bin/env ts-node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { basename, dirname, join } from 'path';

const args = process.argv.slice(2);
const fullPath = args[0];

if (!fullPath) {
  console.error('❌ กรุณาระบุชื่อ repository เช่น: generate-repository.ts user');
  process.exit(1);
}
const folderPath = join(__dirname, 'src', 'repositories');
const name = basename(fullPath);
const className = `${capitalize(name)}Repository`;
const fileName = `${name}.repository.ts`;
// const folderPath = join(__dirname, 'src', name);
const filePath = join(folderPath, fileName);

if (!existsSync(folderPath)) {
  mkdirSync(folderPath, { recursive: true });
}

const content = `import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ${capitalize(name)}Entity } from 'src/models/entities/${name}.entity';

export class ${className} {
  constructor(@InjectEntityManager() private readonly db: EntityManager) {}

  private get repo() {
        return this.db.getRepository(${capitalize(name)}Entity);
  }

  async findAll(): Promise<${capitalize(name)}Entity[]> {
   return this.repo.find();
  }

  async findById(id: number): Promise<${capitalize(name)}Entity | null> {
     return this.repo.findOneBy({ id });
  }

  async create(data: Partial<${capitalize(name)}Entity>): Promise<number> {
        const user = await this.repo.save(data);
        return user.id;
  }

  async update(id: number, data: Partial<${capitalize(name)}Entity>): Promise<void> {
     await this.repo.update(id, data);
  }

  async delete(id: number): Promise<void> {
     await this.repo.delete(id);
  }
}
`;

writeFileSync(filePath, content);
console.log(`✅ สร้าง ${fileName} สำเร็จที่ ${folderPath}`);

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
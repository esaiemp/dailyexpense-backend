import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRelationshipBetweenUserAndExpneseEntities1713563048180 implements MigrationInterface {
    name = 'AddedRelationshipBetweenUserAndExpneseEntities1713563048180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expense\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_06e076479515578ab1933ab4375\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_06e076479515578ab1933ab4375\``);
        await queryRunner.query(`ALTER TABLE \`expense\` DROP COLUMN \`userId\``);
    }

}

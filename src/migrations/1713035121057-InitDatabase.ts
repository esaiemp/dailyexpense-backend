import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1713035121057 implements MigrationInterface {
    name = 'InitDatabase1713035121057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(125) NOT NULL, \`description\` varchar(255) NULL, \`isDeleted\` tinyint(1) NULL, \`createdBy\` varchar(255) NULL, \`createdDate\` datetime NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` datetime NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`receipt\` (\`id\` int NOT NULL AUTO_INCREMENT, \`expenseId\` int NOT NULL, \`fileName\` varchar(150) NULL, \`mimeType\` varchar(150) NULL, \`filePath\` varchar(255) NULL, \`size\` int NULL, \`isDeleted\` tinyint(1) NULL, \`createdBy\` varchar(255) NULL, \`createdDate\` datetime NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expense\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoryId\` int NOT NULL, \`name\` varchar(125) NOT NULL, \`description\` varchar(250) NULL, \`amount\` decimal(10,2) NOT NULL, \`amountCurrency\` varchar(50) NOT NULL, \`expenseDate\` datetime NOT NULL, \`isDeleted\` tinyint(1) NULL, \`createdBy\` varchar(255) NULL, \`createdDate\` datetime NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(100) NOT NULL, \`displayName\` varchar(200) NULL, \`password\` varchar(100) NOT NULL, \`lastLoginDate\` datetime NULL, \`isDeleted\` tinyint(1) NULL, \`createdBy\` varchar(255) NULL, \`createdDate\` datetime NULL, \`lastModifiedBy\` varchar(255) NULL, \`lastModifiedDate\` datetime NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`receipt\` ADD CONSTRAINT \`FK_b141a552a111844e9238b927908\` FOREIGN KEY (\`expenseId\`) REFERENCES \`expense\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_42eea5debc63f4d1bf89881c10a\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_42eea5debc63f4d1bf89881c10a\``);
        await queryRunner.query(`ALTER TABLE \`receipt\` DROP FOREIGN KEY \`FK_b141a552a111844e9238b927908\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`expense\``);
        await queryRunner.query(`DROP TABLE \`receipt\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
    }

}

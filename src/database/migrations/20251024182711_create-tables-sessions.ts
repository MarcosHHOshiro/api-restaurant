import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("tables_sessions", (table) => {
        table.increments("id").primary();
        table.integer("table_id").references("id").inTable("tables").notNullable();
        table.timestamp("opened_at").defaultTo(knex.fn.now());
        table.timestamp("closed_at");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("tables_sessions");
}


/**
 * Tables service file to query the "tables" database
 */

const knex = require("../db/connection");

/**
 * Inserts a table into the tables db
 */
function create(table) {

    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
        
};

/**
 * Lists and orders tables from the tables db
 */
function list() {

    return knex("tables")
        .select("*")
        .orderBy("table_name");

};

/**
 * Reads a table given a table_id
 * @param {table_id}
 */
function read(table_id) {

    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
        
};

/**
 * Async function to update both table and reservation status
 * @param {reservation_id, table_id}
 */
async function seatUpdate(reservation_id, table_id) {

    return await knex.transaction(async trx => {

        const updatedTables = await trx("tables")
            .select("*")
            .where({ table_id })
            .update({ reservation_id }, "*")

        await trx("reservations")
            .select("*")
            .where({ reservation_id })
            .update({ status: "seated" }, "*")

        return updatedTables[0];
    });

};

/**
 * Async function to clear a table and change reservation status
 * @param {reservation_id, table_id}
 */
async function clear(table_id, reservation_id) {

    return await knex.transaction(async trx => {

        const updatedTables = await trx("tables")
            .select("*")
            .where({ table_id })
            .update({ reservation_id: null }, "*")

        await trx("reservations")
            .select("*")
            .where({ reservation_id })
            .update({ status: "finished" }, "*")

        return updatedTables[0];
    });

};

module.exports = {
    clear,
    create,
    list,
    read,
    seatUpdate,
    
};


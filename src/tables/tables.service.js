const knex = require("../db/connection");

function create(table) {

    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
        
};

function list() {

    return knex("tables")
        .select("*")
        .orderBy("table_name");

};

function read(table_id) {

    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
        
};

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

        return updatedTables;
    });

};

async function clear(reservation_id, table_id) {

    return await knex.transaction(async trx => {

        const updatedTables = await trx("tables")
            .select("*")
            .where({ table_id })
            .update({ "reservation_id": null }, "*")

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


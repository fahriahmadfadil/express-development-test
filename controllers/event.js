const Validator = require("fastest-validator");
const models = require("../models");
const Sequelize = require('sequelize');
const db = require("../models");

const responds = (status, data) => {
    resp = {
        status: status,
        data: data,
    }

    return resp;
}

/* declare all function */
function showAllData(req, res, next) {
    const limit = req.query.limit;
    const offset = req.query.offset;

    models.Event.findAll({ order: [["id", "DESC"]],limit,offset })
        .then((result) => {
            res.status(200).json(responds(true, result));
        })
        .catch((error) => {
            res.status(500).json(responds(false, "something wrong : "+error));
        });
}

function showOneData(req, res, next) {
    const id = req.params.id;
    models.Event.findByPk(id)
        .then((result) => {
            res.status(200).json(responds(true, result));
        })
        .catch((error) => {
            res.status(500).json(responds(false, "something wrong : "+error));
        });
}

function insertData(req, res, next) {
    const dataEvent = {
        name: req.body.name,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        image: req.body.image,
    }

    console.log(dataEvent)

    const schema = {
        name: { type: "string", optional: false, max: "150" },
        date: { type: "string", optional: false },
        time: { type: "string", optional: false },
        location: { type: "string", optional: false },
    }    

    const vld = new Validator();
    const validationResponse = vld.validate(dataEvent, schema);
    if (validationResponse !== true) {
        return res.status(500).json(responds(false, "validation failed"));
    }

    models.Event.create(dataEvent)
    .then((result) => {
        res
        .status(200)
        .json(responds(true, result));
    })
    .catch((error) => {
        res.status(500).json(responds(false, "something wrong : "+error));
    });
}

function updateData(req, res, next) {
    const id = req.params.id;

    const dataEvent = {
        name: req.body.name,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        image: req.body.image,
    }

    const schema = {
        name: { type: "string", optional: false, max: "150" },
        date: { type: "string", optional: false },
        time: { type: "string", optional: false },
        location: { type: "string", optional: false },
    }    

    const vld = new Validator();
    const validationResponse = vld.validate(dataEvent, schema);
    if (validationResponse !== true) {
        return res.status(500).json(responds(false, "validation failed"));
    }

    models.Event.update(dataEvent, { where: { id: id } })
    .then((result) => {
        res
        .status(200)
        .json(responds(true, result));
    })
    .catch((error) => {
        res.status(500).json(responds(false, "something wrong : "+error));
    });
}

function deleteData(req, res, next) {
    const id = req.params.id;
    models.Event.destroy({ where: { id: id } })
        .then((result) => {
            res.status(200).json(responds(true, "delete event successfully"));
        })
        .catch((error) => {
            res.status(500).json(responds(false, "something wrong : "+error));
        });
}

module.exports = {showAllData,showOneData,insertData,updateData,deleteData}
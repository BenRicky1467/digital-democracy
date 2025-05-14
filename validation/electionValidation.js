const Joi = require('joi');

const electionSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
});

const candidateSchema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
});

const voteSchema = Joi.object({
    candidateId: Joi.number().integer().required(),
});

module.exports = {
    electionSchema,
    candidateSchema,
    voteSchema
};
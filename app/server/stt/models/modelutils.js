'use strict';

const keyReference = Model => ({model: Model, key: 'id'});
const uuidReference = Model => ({model: Model, key: 'uuid'});

module.exports = {keyReference, uuidReference};

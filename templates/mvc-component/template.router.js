/**
 * Defines the available routes for the Template component.
 * 
 * @author <YOUR NAME HERE>
 */

const routes = require('express').Router();
const { endpoints } = require('./template.controller');
const { asyncController } = require('../util/async.decorators');

/**
 * GET /template/:templateId
 */
routes.get('/:templateId', asyncController(endpoints.getOne));

/**
 * GET /template/
 */
routes.get('/', asyncController(endpoints.getMany));

/**
 * POST /template/
 */
routes.post('/', asyncController(endpoints.create));

/**
 * PATCH /template/:templateId
 */
routes.patch('/:templateId', asyncController(endpoints.update));

/**
 * DEL /template/:templateId
 */
routes.delete('/:templateId', asyncController(endpoints.delete));

module.exports = routes;
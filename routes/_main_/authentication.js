/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * This model implements web login Authentication
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */
var fs = require('fs');
var framework = require('./framework');
var _framework = new framework();

/**
 * Authentication for no login user
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {callback} next - callback function
 */
exports.Authentication = function (req, res, next) {
    //user had login?
    if (!req.session.user) {
        req.session.error=_framework.getError(req,"Please Login first");
        return res.redirect('/');
    }
    next();
}

/**
 * if user had login, no Authentication
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {callback} next - callback function
 */
exports.notAuthentication = function (req, res, next) {
    //user had login?
    if (req.session.user) {
        req.session.error=_framework.getError(req,"Already Login");
        return res.redirect('/index');
    }
    next();
}
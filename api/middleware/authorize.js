/** 
 * @param {Array} allowedRoles
 */
function authorize(allowedRoles) { // [Roles.ADMIN, Roles.DOCTOR]
    return function(req, res, next) {
        const isAllowed = allowedRoles.includes(req.userData.role);
        if (isAllowed) next();
        else {
            return res.status(401).json({
                message: "NOT allowed!"
            })
        }

    }
}

module.exports = authorize;